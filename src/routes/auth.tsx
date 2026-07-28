import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const authSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
  fullName: z.string().trim().max(100).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { mode?: "signin" | "signup" } => ({
    mode: (s.mode as string) === "signup" ? "signup" : (s.mode as string) === "signin" ? "signin" : undefined,
  }),


  head: () => ({
    meta: [
      { title: "Sign in — WealthPulse" },
      { name: "description", content: "Access your WealthPulse account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode: initialMode } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode ?? "signin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const parsed = authSchema.safeParse({ email, password, fullName });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      setLoading(false);
      return;
    }
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName || null },
          },
        });
        if (error) throw error;

        if (data.session) {
          // Email confirmation is disabled on this Supabase project — user is signed in immediately.
          toast.success("Account created! Signing you in…");
          navigate({ to: "/dashboard", replace: true });
        } else if (data.user && data.user.identities && data.user.identities.length === 0) {
          // Supabase returns a "successful" response with no identities when the email
          // already belongs to a confirmed account, to avoid leaking which emails exist.
          toast.error("An account with this email already exists. Please log in.");
          setMode("signin");
          setPassword("");
        } else {
          // No session returned means Supabase is waiting on email confirmation.
          toast.success("Account created! Check your email to verify your address before signing in.");
          setMode("signin");
          setPassword("");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Auth failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between gradient-primary p-12 text-primary-foreground">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-foreground/15 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold">WealthPulse</span>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            Small habits.
            <br /> Serious wealth.
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/85">
            Track your income, expenses, savings goals and investments — while building the daily
            financial habits that make it all compound.
          </p>
        </div>
        <div className="text-xs text-primary-foreground/70">
          © {new Date().getFullYear()} WealthPulse
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="md:hidden mb-6 inline-flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">WealthPulse</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Start building wealth-growing habits today."
              : "Sign in to continue tracking your progress."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  maxLength={100}
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full gradient-primary shadow-soft">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "New to WealthPulse?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
