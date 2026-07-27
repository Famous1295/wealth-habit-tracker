import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { formatCurrency, INVESTMENT_TYPES } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, startOfMonth, subMonths } from "date-fns";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";

const COLORS = ["hsl(292 76% 50%)", "hsl(292 60% 70%)", "hsl(155 55% 55%)", "hsl(75 75% 60%)", "hsl(27 80% 60%)", "hsl(210 70% 55%)", "hsl(340 70% 60%)"];

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Wealth Analytics — WealthPulse" },
      { name: "description", content: "Investments, net worth, growth trends — visualized." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { user } = useAuth();
  const uid = user!.id;
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["analytics", uid],
    queryFn: async () => {
      const [inc, exp, inv] = await Promise.all([
        supabase.from("incomes").select("*").eq("user_id", uid),
        supabase.from("expenses").select("*").eq("user_id", uid),
        supabase.from("investments").select("*").eq("user_id", uid).order("purchased_on", { ascending: false }),
      ]);
      return { incomes: inc.data ?? [], expenses: exp.data ?? [], investments: inv.data ?? [] };
    },
  });

  const [name, setName] = useState("");
  const [type, setType] = useState<string>(INVESTMENT_TYPES[0]);
  const [investedInput, setInvestedInput] = useState("");
  const [currentInput, setCurrentInput] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const addInv = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("Name required");
      const iv = Number(investedInput);
      const cv = Number(currentInput || investedInput);
      if (!(iv >= 0)) throw new Error("Invested must be >= 0");
      const { error } = await supabase.from("investments").insert({
        user_id: uid,
        name: name.trim().slice(0, 100),
        asset_type: type,
        invested_amount: iv,
        current_value: cv,
        purchased_on: date,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Investment added");
      setName("");
      setInvestedInput("");
      setCurrentInput("");
      qc.invalidateQueries({ queryKey: ["analytics", uid] });
      qc.invalidateQueries({ queryKey: ["dashboard", uid] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateValue = useMutation({
    mutationFn: async ({ id, val }: { id: string; val: number }) => {
      const { error } = await supabase.from("investments").update({ current_value: val }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["analytics", uid] }),
  });

  const removeInv = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("investments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries({ queryKey: ["analytics", uid] });
      qc.invalidateQueries({ queryKey: ["dashboard", uid] });
    },
  });

  if (!q.data) return <div className="p-6 text-muted-foreground">Loading…</div>;
  const { incomes, expenses, investments } = q.data;

  const invested = investments.reduce((s, i) => s + Number(i.invested_amount), 0);
  const currentVal = investments.reduce((s, i) => s + Number(i.current_value), 0);
  const gain = currentVal - invested;
  const gainPct = invested > 0 ? (gain / invested) * 100 : 0;

  // Net worth trend (last 12 months, cumulative saved + current investments proportional)
  const months = Array.from({ length: 12 }).map((_, i) => startOfMonth(subMonths(new Date(), 11 - i)));
  const trend = months.map((d) => {
    const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const savedUpTo =
      incomes.filter((r) => new Date(r.received_on) < nextMonth).reduce((s, r) => s + Number(r.amount), 0) -
      expenses.filter((r) => new Date(r.spent_on) < nextMonth).reduce((s, r) => s + Number(r.amount), 0);
    const investedUpTo = investments
      .filter((i) => new Date(i.purchased_on) < nextMonth)
      .reduce((s, i) => s + Number(i.current_value), 0);
    return { month: format(d, "MMM"), netWorth: savedUpTo + investedUpTo, saved: savedUpTo, invested: investedUpTo };
  });

  // Allocation
  const alloc = new Map<string, number>();
  investments.forEach((i) => alloc.set(i.asset_type, (alloc.get(i.asset_type) ?? 0) + Number(i.current_value)));
  const allocData = Array.from(alloc.entries()).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Wealth analytics</h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">Investments, allocation, and net-worth growth over time.</p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-soft"><CardContent className="p-4 sm:p-5">
          <div className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground truncate">Invested</div>
          <div className="mt-2 font-display text-lg sm:text-2xl font-bold break-words">{formatCurrency(invested)}</div>
        </CardContent></Card>
        <Card className="shadow-soft"><CardContent className="p-4 sm:p-5">
          <div className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground truncate">Current value</div>
          <div className="mt-2 font-display text-lg sm:text-2xl font-bold text-primary break-words">{formatCurrency(currentVal)}</div>
        </CardContent></Card>
        <Card className="shadow-soft col-span-2 lg:col-span-1"><CardContent className="p-4 sm:p-5">
          <div className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground truncate">Gain / loss</div>
          <div className={`mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-lg sm:text-2xl font-bold break-words ${gain >= 0 ? "text-success" : "text-destructive"}`}>
            {gain >= 0 ? <TrendingUp className="h-5 w-5 shrink-0" /> : <TrendingDown className="h-5 w-5 shrink-0" />}
            <span>{formatCurrency(gain)}</span> <span className="text-xs sm:text-sm font-normal">({gainPct.toFixed(1)}%)</span>
          </div>
        </CardContent></Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader><CardTitle>Net worth trend (12 months)</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="nw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend />
                <Area type="monotone" dataKey="netWorth" name="Net worth" stroke="var(--color-primary)" fill="url(#nw)" strokeWidth={2} />
                <Area type="monotone" dataKey="saved" name="Savings" stroke="var(--color-primary-glow)" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader><CardTitle>Portfolio allocation</CardTitle></CardHeader>
          <CardContent>
            {allocData.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Add investments to see allocation.</div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={allocData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={95} paddingAngle={2}>
                      {allocData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle>Invested vs current</CardTitle></CardHeader>
          <CardContent>
            {investments.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Nothing to compare yet.</div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={investments.map((i) => ({ name: i.name, invested: Number(i.invested_amount), current: Number(i.current_value) }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                    <Legend />
                    <Bar dataKey="invested" fill="var(--color-primary-glow)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="current" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader><CardTitle>Add an investment</CardTitle></CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addInv.mutate();
            }}
            className="grid gap-4 md:grid-cols-6"
          >
            <div className="md:col-span-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Apple stock" maxLength={100} required /></div>
            <div>
              <Label>Type</Label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                {INVESTMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div><Label>Invested</Label><Input type="number" min="0" step="0.01" value={investedInput} onChange={(e) => setInvestedInput(e.target.value)} required /></div>
            <div><Label>Current value</Label><Input type="number" min="0" step="0.01" value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} placeholder="Same as invested" /></div>
            <div><Label>Purchased</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></div>
            <div className="md:col-span-6">
              <Button type="submit" disabled={addInv.isPending} className="gradient-primary">
                <Plus className="mr-1 h-4 w-4" /> Add investment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {investments.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader><CardTitle>Your investments</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {investments.map((i) => {
              const g = Number(i.current_value) - Number(i.invested_amount);
              return (
                <div key={i.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold break-words">{i.name} <span className="ml-2 inline-block rounded bg-secondary px-2 py-0.5 text-xs">{i.asset_type}</span></div>
                    <div className="text-xs text-muted-foreground break-words">Invested {formatCurrency(Number(i.invested_amount))} · {i.purchased_on}</div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <Input
                      type="number"
                      step="0.01"
                      defaultValue={Number(i.current_value)}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v >= 0 && v !== Number(i.current_value)) updateValue.mutate({ id: i.id, val: v });
                      }}
                      className="w-24 sm:w-32"
                    />
                    <span className={`font-mono text-sm ${g >= 0 ? "text-success" : "text-destructive"}`}>
                      {g >= 0 ? "+" : ""}{formatCurrency(g)}
                    </span>
                    <button onClick={() => removeInv.mutate(i.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
