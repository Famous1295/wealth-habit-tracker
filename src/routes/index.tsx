import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles,
  TrendingUp,
  Target,
  Repeat2,
  LineChart,
  Wallet,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "WealthPulse — Build Wealth, One Habit At A Time" },
      {
        name: "description",
        content:
          "Track income, expenses, savings goals & investments while building financial habits that compound.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-primary shadow-elegant">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">WealthPulse</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/auth"
            className="hidden sm:inline-flex rounded-md px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            search={{ mode: "signup" } as never}
            className="rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-surface" />
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Habits × Wealth Tracking
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl md:text-7xl">
            Build wealth,{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              one habit
            </span>{" "}
            at a time.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            WealthPulse fuses daily financial habits with real-time wealth tracking. Save
            consistently, watch your net worth grow, and stay accountable — all in one place.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth"
              search={{ mode: "signup" } as never}
              className="inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:scale-[1.02]"
            >
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-transform hover:-translate-y-1"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-4xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} WealthPulse. Build financial habits that compound.
      </footer>
    </div>
  );
}

const FEATURES = [
  {
    icon: Wallet,
    title: "Track every dollar",
    desc: "Log income and expenses in seconds. Categorize spending and see where your money really goes.",
  },
  {
    icon: Repeat2,
    title: "Build unbreakable habits",
    desc: "Save daily, review weekly, invest monthly. Streaks keep you consistent.",
  },
  {
    icon: Target,
    title: "Hit real goals",
    desc: "Emergency fund, vacation, new laptop — set targets and watch the progress bars fill.",
  },
  {
    icon: LineChart,
    title: "Wealth analytics",
    desc: "Beautiful charts turn your finances into a story of steady growth.",
  },
  {
    icon: TrendingUp,
    title: "Net worth compounding",
    desc: "Combine savings + investments and see your net worth climb over time.",
  },
  {
    icon: ShieldCheck,
    title: "Private & secure",
    desc: "Your data lives behind row-level security. Only you can see it.",
  },
];

const STATS = [
  { value: "6+", label: "Interconnected modules" },
  { value: "100%", label: "Your data, your control" },
  { value: "0$", label: "Cost to get started" },
  { value: "∞", label: "Habits you can build" },
];
