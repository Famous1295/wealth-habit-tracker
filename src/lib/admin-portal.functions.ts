import { createServerFn } from "@tanstack/react-start";
import crypto from "node:crypto";

// --- Token issuing/verification -------------------------------------------------
// The admin portal is intentionally NOT tied to Supabase user auth — it's a
// separate password gate protected by ADMIN_PORTAL_PASSWORD. On success we hand
// back a signed, time-limited token (HMAC'd with ADMIN_PORTAL_TOKEN_SECRET) that
// the client stores in sessionStorage and passes back on every admin call.

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_PORTAL_TOKEN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_PORTAL_TOKEN_SECRET is not configured on the server.");
  }
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function makeToken(): string {
  const expiry = Date.now() + TOKEN_TTL_MS;
  return `${expiry}.${sign(String(expiry))}`;
}

function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [expiryStr, sig] = token.split(".");
  if (!expiryStr || !sig) return false;
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;
  const expected = sign(expiryStr);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function assertAdmin(token: string | undefined) {
  if (!verifyToken(token)) {
    throw new Error("Unauthorized: admin session is invalid or expired. Please log in again.");
  }
}

async function getAdminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

// --- Auth -----------------------------------------------------------------------

export const adminPortalLogin = createServerFn({ method: "POST" })
  .inputValidator((v: { password: string }) => v)
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PORTAL_PASSWORD;
    if (!expected) {
      throw new Error("ADMIN_PORTAL_PASSWORD is not configured on the server.");
    }
    const a = Buffer.from(data.password ?? "");
    const b = Buffer.from(expected);
    const match = a.length === b.length && crypto.timingSafeEqual(a, b);
    if (!match) {
      throw new Error("Incorrect password.");
    }
    return { token: makeToken() };
  });

// --- Overview / read --------------------------------------------------------------

export const adminListOverview = createServerFn({ method: "POST" })
  .inputValidator((v: { token: string }) => v)
  .handler(async ({ data }) => {
    assertAdmin(data.token);
    const supabaseAdmin = await getAdminClient();

    const [
      authUsers,
      profiles,
      roles,
      incomes,
      expenses,
      goals,
      investments,
      habits,
      logs,
      feedback,
    ] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
      supabaseAdmin.from("profiles").select("*"),
      supabaseAdmin.from("user_roles").select("*"),
      supabaseAdmin.from("incomes").select("*").order("received_on", { ascending: false }),
      supabaseAdmin.from("expenses").select("*").order("spent_on", { ascending: false }),
      supabaseAdmin.from("savings_goals").select("*"),
      supabaseAdmin.from("investments").select("*"),
      supabaseAdmin.from("habits").select("user_id"),
      supabaseAdmin.from("habit_logs").select("user_id"),
      supabaseAdmin.from("feedback").select("*").order("created_at", { ascending: false }),
    ]);

    const emailByUserId = new Map(authUsers.data.users.map((u) => [u.id, u.email ?? ""]));
    const currencyByUserId = new Map((profiles.data ?? []).map((p) => [p.id, p.currency ?? "USD"]));

    return {
      users: authUsers.data.users.map((u) => ({
        id: u.id,
        email: u.email ?? "",
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        email_confirmed_at: u.email_confirmed_at ?? null,
      })),
      profiles: profiles.data ?? [],
      roles: roles.data ?? [],
      incomes: (incomes.data ?? []).map((r) => ({
        ...r,
        email: emailByUserId.get(r.user_id) ?? "",
        currency: currencyByUserId.get(r.user_id) ?? "USD",
      })),
      expenses: (expenses.data ?? []).map((r) => ({
        ...r,
        email: emailByUserId.get(r.user_id) ?? "",
        currency: currencyByUserId.get(r.user_id) ?? "USD",
      })),
      goals: (goals.data ?? []).map((r) => ({
        ...r,
        email: emailByUserId.get(r.user_id) ?? "",
        currency: currencyByUserId.get(r.user_id) ?? "USD",
      })),
      investments: (investments.data ?? []).map((r) => ({
        ...r,
        email: emailByUserId.get(r.user_id) ?? "",
        currency: currencyByUserId.get(r.user_id) ?? "USD",
      })),
      habits: habits.data ?? [],
      logs: logs.data ?? [],
      feedback: (feedback.data ?? []).map((r) => ({ ...r, email: emailByUserId.get(r.user_id) ?? "" })),
    };
  });

// --- User management ---------------------------------------------------------------

export const adminCreateUser = createServerFn({ method: "POST" })
  .inputValidator((v: { token: string; email: string; password: string; fullName?: string; makeAdmin?: boolean }) => v)
  .handler(async ({ data }) => {
    assertAdmin(data.token);
    const supabaseAdmin = await getAdminClient();

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName || null },
    });
    if (error) throw error;

    if (data.makeAdmin && created.user) {
      const { error: roleErr } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: created.user.id, role: "admin" });
      if (roleErr) throw roleErr;
    }
    return { id: created.user?.id };
  });

export const adminDeleteUser = createServerFn({ method: "POST" })
  .inputValidator((v: { token: string; userId: string }) => v)
  .handler(async ({ data }) => {
    assertAdmin(data.token);
    const supabaseAdmin = await getAdminClient();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw error;
    return { ok: true };
  });

export const adminSetRole = createServerFn({ method: "POST" })
  .inputValidator((v: { token: string; userId: string; makeAdmin: boolean }) => v)
  .handler(async ({ data }) => {
    assertAdmin(data.token);
    const supabaseAdmin = await getAdminClient();

    if (data.makeAdmin) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: "admin" }, { onConflict: "user_id,role" });
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", "admin");
      if (error) throw error;
    }
    return { ok: true };
  });

export const adminUpdateProfile = createServerFn({ method: "POST" })
  .inputValidator(
    (v: { token: string; userId: string; patch: { full_name?: string; currency?: string; monthly_income?: number } }) =>
      v,
  )
  .handler(async ({ data }) => {
    assertAdmin(data.token);
    const supabaseAdmin = await getAdminClient();
    const { error } = await supabaseAdmin.from("profiles").update(data.patch).eq("id", data.userId);
    if (error) throw error;
    return { ok: true };
  });

// --- Generic record CRUD (incomes/expenses/goals/investments/feedback) ------------

const EDITABLE_TABLES = ["incomes", "expenses", "savings_goals", "investments", "feedback"] as const;
type EditableTable = (typeof EDITABLE_TABLES)[number];

function assertTable(table: string): asserts table is EditableTable {
  if (!EDITABLE_TABLES.includes(table as EditableTable)) {
    throw new Error(`Table "${table}" is not editable through the admin portal.`);
  }
}

export const adminUpdateRecord = createServerFn({ method: "POST" })
  .inputValidator((v: { token: string; table: string; id: string; patch: Record<string, unknown> }) => v)
  .handler(async ({ data }) => {
    assertAdmin(data.token);
    assertTable(data.table);
    const supabaseAdmin = await getAdminClient();
    const { error } = await supabaseAdmin.from(data.table).update(data.patch).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminDeleteRecord = createServerFn({ method: "POST" })
  .inputValidator((v: { token: string; table: string; id: string }) => v)
  .handler(async ({ data }) => {
    assertAdmin(data.token);
    assertTable(data.table);
    const supabaseAdmin = await getAdminClient();
    const { error } = await supabaseAdmin.from(data.table).delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
