import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShieldCheck, Loader2, Trash2, UserPlus, Crown, CrownIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  adminPortalLogin,
  adminListOverview,
  adminCreateUser,
  adminDeleteUser,
  adminSetRole,
  adminUpdateRecord,
  adminDeleteRecord,
} from "@/lib/admin-portal.functions";

const STORAGE_KEY = "admin-portal-token";

export const Route = createFileRoute("/adminportal")({
  head: () => ({
    meta: [
      { title: "Admin Portal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPortalPage,
});

function AdminPortalPage() {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null,
  );

  if (!token) {
    return <PasswordGate onSuccess={(t) => { sessionStorage.setItem(STORAGE_KEY, t); setToken(t); }} />;
  }

  return (
    <AdminDashboard
      token={token}
      onUnauthorized={() => {
        sessionStorage.removeItem(STORAGE_KEY);
        setToken(null);
      }}
    />
  );
}

function PasswordGate({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminPortalLogin({ data: { password } });
      onSuccess(res.token);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-sm shadow-elegant">
        <CardHeader className="items-center text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-foreground text-background">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="mt-2">Admin Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                autoFocus
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDashboard({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["admin-portal-overview"],
    queryFn: () => adminListOverview({ data: { token } }),
    retry: false,
  });

  useEffect(() => {
    if (q.error) {
      toast.error(q.error instanceof Error ? q.error.message : "Session expired");
      onUnauthorized();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.error]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-portal-overview"] });

  const setRole = useMutation({
    mutationFn: (v: { userId: string; makeAdmin: boolean }) => adminSetRole({ data: { token, ...v } }),
    onSuccess: () => {
      toast.success("Role updated");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteUser = useMutation({
    mutationFn: (userId: string) => adminDeleteUser({ data: { token, userId } }),
    onSuccess: () => {
      toast.success("User deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const createUser = useMutation({
    mutationFn: (v: { email: string; password: string; fullName: string; makeAdmin: boolean }) =>
      adminCreateUser({ data: { token, ...v } }),
    onSuccess: () => {
      toast.success("User created");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteRecord = useMutation({
    mutationFn: (v: { table: string; id: string }) => adminDeleteRecord({ data: { token, ...v } }),
    onSuccess: () => {
      toast.success("Deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateRecord = useMutation({
    mutationFn: (v: { table: string; id: string; patch: Record<string, unknown> }) =>
      adminUpdateRecord({ data: { token, ...v } }),
    onSuccess: () => {
      toast.success("Saved");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [viewUserId, setViewUserId] = useState<string | null>(null);

  const adminUserIds = useMemo(
    () => new Set((q.data?.roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id)),
    [q.data],
  );
  const profileById = useMemo(
    () => new Map((q.data?.profiles ?? []).map((p) => [p.id, p])),
    [q.data],
  );

  if (q.isLoading || !q.data) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const totalIncome = q.data.incomes.reduce((s, r) => s + Number(r.amount), 0);
  const totalExpense = q.data.expenses.reduce((s, r) => s + Number(r.amount), 0);
  const totalInvested = q.data.investments.reduce((s, r) => s + Number(r.current_value), 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-foreground text-background">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">Full platform access — every user, every record.</p>
          </div>
        </div>
        <AddUserDialog onCreate={(v) => createUser.mutate(v)} pending={createUser.isPending} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat label="Total users" value={String(q.data.users.length)} />
        <Stat label="Admins" value={String(adminUserIds.size)} />
        <Stat label="Total income" value={formatCurrency(totalIncome)} />
        <Stat label="Total expenses" value={formatCurrency(totalExpense)} />
      </div>
      <p className="-mt-3 text-xs text-muted-foreground">
        Totals are a raw sum across all users and don't account for differing currencies — see each user's own
        currency in the tables below.
      </p>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="money">Money records</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="mt-4 shadow-soft">
            <CardHeader>
              <CardTitle>Users ({q.data.users.length})</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {q.data.users.map((u) => {
                    const isAdmin = adminUserIds.has(u.id);
                    const profile = profileById.get(u.id);
                    return (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">
                          <button
                            onClick={() => setViewUserId(u.id)}
                            className="text-left text-primary hover:underline"
                          >
                            {u.email}
                          </button>
                        </TableCell>
                        <TableCell>{profile?.full_name ?? "—"}</TableCell>
                        <TableCell>{formatDate(u.created_at)}</TableCell>
                        <TableCell>
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                              <Crown className="h-3 w-3" /> Admin
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">User</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRole.mutate({ userId: u.id, makeAdmin: !isAdmin })}
                          >
                            <CrownIcon className="mr-1 h-3.5 w-3.5" />
                            {isAdmin ? "Remove admin" : "Make admin"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm(`Delete ${u.email}? This removes all their data permanently.`)) {
                                deleteUser.mutate(u.id);
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="money">
          <div className="mt-4 space-y-6">
            <MoneyTable
              title="Incomes"
              rows={q.data.incomes}
              columns={["email", "source", "amount", "received_on", "note"]}
              table="incomes"
              onDelete={(id) => deleteRecord.mutate({ table: "incomes", id })}
              onSave={(id, patch) => updateRecord.mutate({ table: "incomes", id, patch })}
            />
            <MoneyTable
              title="Expenses"
              rows={q.data.expenses}
              columns={["email", "category", "amount", "spent_on", "note"]}
              table="expenses"
              onDelete={(id) => deleteRecord.mutate({ table: "expenses", id })}
              onSave={(id, patch) => updateRecord.mutate({ table: "expenses", id, patch })}
            />
            <MoneyTable
              title="Investments"
              rows={q.data.investments}
              columns={["email", "name", "invested_amount", "current_value"]}
              table="investments"
              onDelete={(id) => deleteRecord.mutate({ table: "investments", id })}
              onSave={(id, patch) => updateRecord.mutate({ table: "investments", id, patch })}
            />
            <MoneyTable
              title="Savings goals"
              rows={q.data.goals}
              columns={["email", "name", "target_amount", "saved_amount"]}
              table="savings_goals"
              onDelete={(id) => deleteRecord.mutate({ table: "savings_goals", id })}
              onSave={(id, patch) => updateRecord.mutate({ table: "savings_goals", id, patch })}
            />
            <p className="text-xs text-muted-foreground">
              Total investments value across all users: {formatCurrency(totalInvested)}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <Card className="mt-4 shadow-soft">
            <CardHeader>
              <CardTitle>Feedback ({q.data.feedback.length})</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {q.data.feedback.map((f: any) => (
                    <TableRow key={f.id}>
                      <TableCell>{f.email}</TableCell>
                      <TableCell className="max-w-md truncate">{f.message}</TableCell>
                      <TableCell>{f.status}</TableCell>
                      <TableCell>{formatDate(f.created_at)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {f.status !== "resolved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateRecord.mutate({ table: "feedback", id: f.id, patch: { status: "resolved" } })}
                          >
                            Resolve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteRecord.mutate({ table: "feedback", id: f.id })}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!viewUserId} onOpenChange={(open) => !open && setViewUserId(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          {viewUserId && <UserDetailView userId={viewUserId} data={q.data} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

type OverviewData = Awaited<ReturnType<typeof adminListOverview>>;

function UserDetailView({ userId, data }: { userId: string; data: OverviewData }) {
  const user = data.users.find((u) => u.id === userId);
  const profile = data.profiles.find((p) => p.id === userId);
  const currency = profile?.currency ?? "USD";
  const incomes = data.incomes.filter((r) => r.user_id === userId);
  const expenses = data.expenses.filter((r) => r.user_id === userId);
  const investments = data.investments.filter((r) => r.user_id === userId);
  const goals = data.goals.filter((r) => r.user_id === userId);
  const habitCount = data.habits.filter((h) => h.user_id === userId).length;
  const logCount = data.logs.filter((l) => l.user_id === userId).length;

  const totalIncome = incomes.reduce((s, r) => s + Number(r.amount), 0);
  const totalExpense = expenses.reduce((s, r) => s + Number(r.amount), 0);
  const totalInvested = investments.reduce((s, r) => s + Number(r.current_value), 0);

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>{profile?.full_name || user?.email}</DialogTitle>
      </DialogHeader>
      <p className="-mt-4 text-sm text-muted-foreground">{user?.email} · Read-only view</p>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Income" value={formatCurrency(totalIncome, currency)} />
        <Stat label="Expenses" value={formatCurrency(totalExpense, currency)} />
        <Stat label="Invested (current)" value={formatCurrency(totalInvested, currency)} />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Incomes ({incomes.length})</h3>
        <ReadOnlyList
          rows={incomes}
          render={(r) => `${r.source} — ${formatCurrency(Number(r.amount), currency)} · ${formatDate(r.received_on)}`}
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Expenses ({expenses.length})</h3>
        <ReadOnlyList
          rows={expenses}
          render={(r) => `${r.category} — ${formatCurrency(Number(r.amount), currency)} · ${formatDate(r.spent_on)}`}
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Investments ({investments.length})</h3>
        <ReadOnlyList
          rows={investments}
          render={(r) => `${r.name} — ${formatCurrency(Number(r.current_value), currency)} (invested ${formatCurrency(Number(r.invested_amount), currency)})`}
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Savings goals ({goals.length})</h3>
        <ReadOnlyList
          rows={goals}
          render={(r) => `${r.name} — ${formatCurrency(Number(r.saved_amount), currency)} of ${formatCurrency(Number(r.target_amount), currency)}`}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Habits: {habitCount} · Habit logs: {logCount}
      </p>
    </div>
  );
}

function ReadOnlyList({ rows, render }: { rows: any[]; render: (r: any) => string }) {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">None yet</p>;
  return (
    <ul className="space-y-1 text-sm">
      {rows.map((r) => (
        <li key={r.id} className="rounded-md bg-muted/50 px-3 py-1.5">
          {render(r)}
        </li>
      ))}
    </ul>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="shadow-soft">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function AddUserDialog({
  onCreate,
  pending,
}: {
  onCreate: (v: { email: string; password: string; fullName: string; makeAdmin: boolean }) => void;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [makeAdmin, setMakeAdmin] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add user
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCreate({ email, password, fullName, makeAdmin });
            setOpen(false);
            setEmail("");
            setPassword("");
            setFullName("");
            setMakeAdmin(false);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Full name (optional)</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={makeAdmin} onChange={(e) => setMakeAdmin(e.target.checked)} />
            Grant admin role
          </label>
          <Button type="submit" disabled={pending} className="w-full">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create user
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MoneyTable({
  title,
  rows,
  columns,
  table,
  onDelete,
  onSave,
}: {
  title: string;
  rows: any[];
  columns: string[];
  table: string;
  onDelete: (id: string) => void;
  onSave: (id: string, patch: Record<string, unknown>) => void;
}) {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>
          {title} ({rows.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c} className="capitalize">
                  {c.replace(/_/g, " ")}
                </TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <EditableRow key={row.id} row={row} columns={columns} onDelete={onDelete} onSave={onSave} />
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center text-sm text-muted-foreground">
                  No records
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function EditableRow({
  row,
  columns,
  onDelete,
  onSave,
}: {
  row: any;
  columns: string[];
  onDelete: (id: string) => void;
  onSave: (id: string, patch: Record<string, unknown>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(columns.filter((c) => c !== "email").map((c) => [c, String(row[c] ?? "")])),
  );

  return (
    <TableRow>
      {columns.map((c) => {
        if (c === "email") return <TableCell key={c}>{row.email}</TableCell>;
        if (!editing) {
          const isMoney = c.includes("amount") || c.includes("value");
          return (
            <TableCell key={c}>
              {isMoney ? formatCurrency(Number(row[c]), row.currency ?? "USD") : String(row[c] ?? "—")}
            </TableCell>
          );
        }
        return (
          <TableCell key={c}>
            <Input
              className="h-8 w-32"
              value={values[c]}
              onChange={(e) => setValues((v) => ({ ...v, [c]: e.target.value }))}
            />
          </TableCell>
        );
      })}
      <TableCell className="text-right space-x-2 whitespace-nowrap">
        {editing ? (
          <>
            <Button
              size="sm"
              onClick={() => {
                const patch: Record<string, unknown> = {};
                for (const c of columns) {
                  if (c === "email") continue;
                  const isNumeric = c.includes("amount") || c.includes("value");
                  patch[c] = isNumeric ? Number(values[c]) : values[c];
                }
                onSave(row.id, patch);
                setEditing(false);
              }}
            >
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(row.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}
