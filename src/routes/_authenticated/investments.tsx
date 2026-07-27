import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { INVESTMENT_TYPES, formatCurrency, formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, TrendingUp, TrendingDown, Briefcase } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  asset_type: z.string().trim().min(1),
  invested_amount: z.number().nonnegative().max(1e12),
  current_value: z.number().nonnegative().max(1e12),
  purchased_on: z.string(),
});

export const Route = createFileRoute("/_authenticated/investments")({
  head: () => ({
    meta: [
      { title: "Investments — WealthPulse" },
      { name: "description", content: "Track your investment portfolio and returns." },
    ],
  }),
  component: InvestmentsPage,
});

const COLORS = [
  "hsl(292 76% 50%)",
  "hsl(292 60% 70%)",
  "hsl(155 55% 55%)",
  "hsl(75 75% 60%)",
  "hsl(27 80% 60%)",
  "hsl(210 70% 55%)",
  "hsl(340 70% 60%)",
];

function InvestmentsPage() {
  const { user } = useAuth();
  const uid = user!.id;
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["investments", uid],
    queryFn: async () =>
      (await supabase.from("investments").select("*").eq("user_id", uid).order("purchased_on", { ascending: false })).data ?? [],
  });

  const add = useMutation({
    mutationFn: async (v: z.infer<typeof schema>) => {
      const { error } = await supabase.from("investments").insert({ ...v, user_id: uid });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Investment added");
      qc.invalidateQueries({ queryKey: ["investments", uid] });
      qc.invalidateQueries({ queryKey: ["dashboard", uid] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("investments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries({ queryKey: ["investments", uid] });
      qc.invalidateQueries({ queryKey: ["dashboard", uid] });
    },
  });

  const rows = q.data ?? [];
  const invested = rows.reduce((s, r) => s + Number(r.invested_amount), 0);
  const currentVal = rows.reduce((s, r) => s + Number(r.current_value), 0);
  const gain = currentVal - invested;
  const gainPct = invested > 0 ? (gain / invested) * 100 : 0;

  const allocation = new Map<string, number>();
  rows.forEach((r) => allocation.set(r.asset_type, (allocation.get(r.asset_type) ?? 0) + Number(r.current_value)));
  const pieData = Array.from(allocation.entries()).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Investment Portfolio</h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">Track holdings, returns and asset allocation.</p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Briefcase className="h-5 w-5" />} label="Invested" value={formatCurrency(invested)} />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Current value" value={formatCurrency(currentVal)} accent="text-primary" />
        <StatCard
          icon={gain >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          label="Total gain/loss"
          value={formatCurrency(gain)}
          accent={gain >= 0 ? "text-success" : "text-destructive"}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Return %"
          value={`${gainPct >= 0 ? "+" : ""}${gainPct.toFixed(2)}%`}
          accent={gainPct >= 0 ? "text-success" : "text-destructive"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle>Add investment</CardTitle>
          </CardHeader>
          <CardContent>
            <InvestmentForm onSubmit={(v) => add.mutate(v)} pending={add.isPending} />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="text-sm text-muted-foreground">Add investments to see allocation.</p>
            ) : (
              <div className="h-56 w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={40} outerRadius={80} paddingAngle={2}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No investments yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Purchased</TableHead>
                  <TableHead className="text-right">Invested</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">P/L</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => {
                  const pl = Number(r.current_value) - Number(r.invested_amount);
                  const pct = Number(r.invested_amount) > 0 ? (pl / Number(r.invested_amount)) * 100 : 0;
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>{r.asset_type}</TableCell>
                      <TableCell>{formatDate(r.purchased_on)}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(Number(r.invested_amount))}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(Number(r.current_value))}</TableCell>
                      <TableCell className={`text-right font-mono ${pl >= 0 ? "text-success" : "text-destructive"}`}>
                        {pl >= 0 ? "+" : ""}
                        {formatCurrency(pl)} ({pct.toFixed(1)}%)
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => del.mutate(r.id)}
                          className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value, accent = "" }: { icon: React.ReactNode; label: string; value: string; accent?: string }) {
  return (
    <Card className="shadow-soft">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground">
          <span className="shrink-0">{icon}</span>
          <span className="truncate">{label}</span>
        </div>
        <div className={`mt-2 font-display text-lg sm:text-2xl font-bold break-words ${accent}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

function InvestmentForm({ onSubmit, pending }: { onSubmit: (v: z.infer<typeof schema>) => void; pending: boolean }) {
  const [name, setName] = useState("");
  const [assetType, setAssetType] = useState<string>(INVESTMENT_TYPES[0]);
  const [invested, setInvested] = useState("");
  const [current, setCurrent] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({
      name,
      asset_type: assetType,
      invested_amount: Number(invested),
      current_value: Number(current || invested),
      purchased_on: date,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid");
      return;
    }
    onSubmit(parsed.data);
    setName("");
    setInvested("");
    setCurrent("");
  }

  return (
    <form onSubmit={submit} className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-6">
      <div className="sm:col-span-2 md:col-span-2">
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Apple Stock" required maxLength={80} />
      </div>
      <div>
        <Label>Type</Label>
        <select
          value={assetType}
          onChange={(e) => setAssetType(e.target.value)}
          className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          {INVESTMENT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <Label>Invested</Label>
        <Input type="number" min="0" step="0.01" value={invested} onChange={(e) => setInvested(e.target.value)} placeholder="0.00" required />
      </div>
      <div>
        <Label>Current value</Label>
        <Input type="number" min="0" step="0.01" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0.00" />
      </div>
      <div>
        <Label>Purchased</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div className="sm:col-span-2 md:col-span-6">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto gradient-primary">
          <Plus className="mr-1 h-4 w-4" /> Add investment
        </Button>
      </div>
    </form>
  );
}
