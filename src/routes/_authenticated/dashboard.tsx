import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Target as TargetIcon,
  Flame,
} from "lucide-react";
import { differenceInCalendarDays, format, startOfMonth, subMonths } from "date-fns";
import { AIInsights } from "@/components/ai-insights";
import { Reminders } from "@/components/reminders";


export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — WealthPulse" },
      { name: "description", content: "Your financial snapshot at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useAuth();
  const uid = user?.id;

  const { data } = useQuery({
    queryKey: ["dashboard", uid],
    enabled: !!uid,
    queryFn: async () => {
      const id = uid!;
      const [incomes, expenses, goals, investments, habits, logs] = await Promise.all([
        supabase.from("incomes").select("*").eq("user_id", id).order("received_on", { ascending: false }),
        supabase.from("expenses").select("*").eq("user_id", id).order("spent_on", { ascending: false }),
        supabase.from("savings_goals").select("*").eq("user_id", id),
        supabase.from("investments").select("*").eq("user_id", id),
        supabase.from("habits").select("*").eq("user_id", id),
        supabase.from("habit_logs").select("*").eq("user_id", id),
      ]);
      return {
        incomes: incomes.data ?? [],
        expenses: expenses.data ?? [],
        goals: goals.data ?? [],
        investments: investments.data ?? [],
        habits: habits.data ?? [],
        logs: logs.data ?? [],
      };
    },
  });

  if (loading || !uid || !data) return <LoadingBlock />;


  const totalIncome = data.incomes.reduce((s, r) => s + Number(r.amount), 0);
  const totalExpense = data.expenses.reduce((s, r) => s + Number(r.amount), 0);
  const totalSavings = totalIncome - totalExpense;
  const totalInvested = data.investments.reduce((s, r) => s + Number(r.current_value), 0);
  const netWorth = totalSavings + totalInvested;

  // Monthly trend (last 6 months)
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = startOfMonth(subMonths(new Date(), 5 - i));
    return { d, label: format(d, "MMM") };
  });
  const trend = months.map(({ d, label }) => {
    const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const inc = data.incomes
      .filter((r) => new Date(r.received_on) >= d && new Date(r.received_on) < nextMonth)
      .reduce((s, r) => s + Number(r.amount), 0);
    const exp = data.expenses
      .filter((r) => new Date(r.spent_on) >= d && new Date(r.spent_on) < nextMonth)
      .reduce((s, r) => s + Number(r.amount), 0);
    return { month: label, income: inc, expense: exp, saved: inc - exp };
  });

  // Category breakdown
  const byCat = new Map<string, number>();
  data.expenses.forEach((r) => byCat.set(r.category, (byCat.get(r.category) ?? 0) + Number(r.amount)));
  const catData = Array.from(byCat.entries()).map(([name, value]) => ({ name, value }));
  const COLORS = ["hsl(292 76% 50%)", "hsl(292 60% 70%)", "hsl(155 55% 55%)", "hsl(75 75% 60%)", "hsl(27 80% 60%)", "hsl(210 70% 55%)", "hsl(340 70% 60%)"];

  // Habit streaks
  const habitStats = data.habits.map((h) => {
    const days = data.logs.filter((l) => l.habit_id === h.id).map((l) => l.logged_on).sort();
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const target = new Date(today);
      target.setDate(target.getDate() - i);
      const key = format(target, "yyyy-MM-dd");
      if (days.includes(key)) streak++;
      else break;
    }
    return { name: h.name, streak, total: days.length };
  });
  const bestStreak = habitStats.reduce((m, h) => Math.max(m, h.streak), 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Your financial pulse</h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
          A live snapshot of your income, spending, and wealth growth.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Wallet className="h-5 w-5" />}
          label="Total income"
          value={formatCurrency(totalIncome)}
          accent="text-success"
        />
        <StatCard
          icon={<TrendingDown className="h-5 w-5" />}
          label="Total expenses"
          value={formatCurrency(totalExpense)}
          accent="text-destructive"
        />
        <StatCard
          icon={<PiggyBank className="h-5 w-5" />}
          label="Net savings"
          value={formatCurrency(totalSavings)}
          accent={totalSavings >= 0 ? "text-primary" : "text-destructive"}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Net worth"
          value={formatCurrency(netWorth)}
          accent="text-primary"
          highlight
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AIInsights />
        </div>
        <Reminders />
      </div>



      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle>Income vs Expenses (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 sm:h-72 w-full">
              <ResponsiveContainer>
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-destructive)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-destructive)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                  />
                  <Area type="monotone" dataKey="income" stroke="var(--color-primary)" fill="url(#inc)" />
                  <Area type="monotone" dataKey="expense" stroke="var(--color-destructive)" fill="url(#exp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Spending by category</CardTitle>
          </CardHeader>
          <CardContent>
            {catData.length === 0 ? (
              <EmptyBlock>No expenses yet.</EmptyBlock>
            ) : (
              <div className="h-56 sm:h-72 w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={catData} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={2}>
                      {catData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                      }}
                      formatter={(v: number) => formatCurrency(v)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" /> Best habit streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display text-4xl sm:text-5xl font-bold text-primary">{bestStreak}</div>
            <div className="text-sm text-muted-foreground">consecutive days</div>
            <div className="mt-6 space-y-2">
              {habitStats.slice(0, 4).map((h) => (
                <div key={h.name} className="flex items-center justify-between text-sm">
                  <span className="truncate">{h.name}</span>
                  <span className="font-mono text-primary">{h.streak}🔥</span>
                </div>
              ))}
              {habitStats.length === 0 && <EmptyBlock>No habits yet.</EmptyBlock>}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TargetIcon className="h-4 w-4 text-primary" /> Savings goals progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.goals.length === 0 && <EmptyBlock>Set your first savings goal.</EmptyBlock>}
            {data.goals.slice(0, 4).map((g) => {
              const pct = Math.min(100, (Number(g.saved_amount) / Number(g.target_amount)) * 100);
              const daysLeft = g.target_date
                ? differenceInCalendarDays(new Date(g.target_date), new Date())
                : null;
              return (
                <div key={g.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{g.name}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(Number(g.saved_amount))} / {formatCurrency(Number(g.target_amount))}
                    </span>
                  </div>
                  <Progress value={pct} />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>{pct.toFixed(0)}% complete</span>
                    {daysLeft !== null && <span>{daysLeft > 0 ? `${daysLeft} days left` : "Due"}</span>}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {data.investments.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Investment portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 sm:h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={data.investments.map((i) => ({
                  name: i.name,
                  invested: Number(i.invested_amount),
                  current: Number(i.current_value),
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                    }}
                    formatter={(v: number) => formatCurrency(v)}
                  />
                  <Bar dataKey="invested" fill="var(--color-primary-glow)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="current" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "shadow-elegant gradient-primary text-primary-foreground border-none" : "shadow-soft"}>
      <CardContent className="p-4 sm:p-5">
        <div className={`flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
          <span className="shrink-0">{icon}</span>
          <span className="truncate">{label}</span>
        </div>
        <div className={`mt-2 font-display text-xl sm:text-2xl lg:text-3xl font-bold break-words ${highlight ? "" : accent}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

function EmptyBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function LoadingBlock() {
  return <div className="p-8 text-center text-muted-foreground">Loading your financial pulse…</div>;
}
