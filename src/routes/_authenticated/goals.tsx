import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Trash2, TrendingUp } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";

export const Route = createFileRoute("/_authenticated/goals")({
  head: () => ({
    meta: [
      { title: "Savings Goals — WealthPulse" },
      { name: "description", content: "Set targets, track progress, hit milestones." },
    ],
  }),
  component: GoalsPage,
});

function GoalsPage() {
  const { user } = useAuth();
  const uid = user!.id;
  const qc = useQueryClient();

  const goalsQ = useQuery({
    queryKey: ["goals", uid],
    queryFn: async () =>
      (await supabase.from("savings_goals").select("*").eq("user_id", uid).order("created_at", { ascending: false })).data ?? [],
  });

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const addGoal = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("Name is required");
      const t = Number(target);
      const s = Number(saved || 0);
      if (!(t > 0)) throw new Error("Target amount must be > 0");
      if (s < 0) throw new Error("Saved must be >= 0");
      const { error } = await supabase.from("savings_goals").insert({
        user_id: uid,
        name: name.trim().slice(0, 100),
        target_amount: t,
        saved_amount: s,
        target_date: targetDate || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Goal created");
      setName("");
      setTarget("");
      setSaved("");
      setTargetDate("");
      qc.invalidateQueries({ queryKey: ["goals", uid] });
      qc.invalidateQueries({ queryKey: ["dashboard", uid] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const contribute = useMutation({
    mutationFn: async ({ id, delta, current }: { id: string; delta: number; current: number }) => {
      const { error } = await supabase
        .from("savings_goals")
        .update({ saved_amount: Math.max(0, current + delta) })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals", uid] });
      qc.invalidateQueries({ queryKey: ["dashboard", uid] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("savings_goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Goal removed");
      qc.invalidateQueries({ queryKey: ["goals", uid] });
      qc.invalidateQueries({ queryKey: ["dashboard", uid] });
    },
  });

  const goals = goalsQ.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Savings goals</h1>
        <p className="mt-1 text-muted-foreground">Set concrete targets and watch the bars fill up.</p>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> New goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addGoal.mutate();
            }}
            className="grid gap-4 md:grid-cols-5"
          >
            <div className="md:col-span-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Emergency fund" maxLength={100} required />
            </div>
            <div>
              <Label>Target amount</Label>
              <Input type="number" min="0.01" step="0.01" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="5000" required />
            </div>
            <div>
              <Label>Starting saved</Label>
              <Input type="number" min="0" step="0.01" value={saved} onChange={(e) => setSaved(e.target.value)} placeholder="0" />
            </div>
            <div>
              <Label>Target date</Label>
              <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
            </div>
            <div className="md:col-span-5">
              <Button type="submit" disabled={addGoal.isPending} className="gradient-primary">
                <Plus className="mr-1 h-4 w-4" /> Create goal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {goals.length === 0 && (
          <Card className="shadow-soft md:col-span-2">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              No goals yet. Try “Emergency fund — $5,000” to start.
            </CardContent>
          </Card>
        )}
        {goals.map((g) => {
          const t = Number(g.target_amount);
          const s = Number(g.saved_amount);
          const pct = Math.min(100, (s / t) * 100);
          const daysLeft = g.target_date ? differenceInCalendarDays(new Date(g.target_date), new Date()) : null;
          const done = s >= t;
          return (
            <Card key={g.id} className={`shadow-soft ${done ? "border-success/50" : ""}`}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-semibold break-words">{g.name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="break-words">{formatCurrency(s)} of {formatCurrency(t)}</span>
                      {done && <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">Achieved 🎉</span>}
                    </div>
                  </div>
                  <button onClick={() => remove.mutate(g.id)} className="shrink-0 rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <Progress value={pct} className="mt-4" />
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{pct.toFixed(1)}%</span>
                  {g.target_date && <span>{daysLeft && daysLeft > 0 ? `${daysLeft} days left · ${formatDate(g.target_date)}` : "Due"}</span>}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {[10, 25, 100].map((amt) => (
                    <Button key={amt} variant="secondary" size="sm" onClick={() => contribute.mutate({ id: g.id, delta: amt, current: s })}>
                      +{formatCurrency(amt)}
                    </Button>
                  ))}
                  <Button size="sm" variant="outline" onClick={() => contribute.mutate({ id: g.id, delta: -10, current: s })}>
                    −{formatCurrency(10)}
                  </Button>
                </div>
                <ManualContribution goalId={g.id} current={s} onSubmit={(delta) => contribute.mutate({ id: g.id, delta, current: s })} />
                <div className="mt-2 flex justify-end">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-primary" /> keep contributing
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ManualContribution({
  goalId,
  onSubmit,
}: {
  goalId: string;
  current: number;
  onSubmit: (delta: number) => void;
}) {
  const [amount, setAmount] = useState("");

  function submit(sign: 1 | -1) {
    const n = Number(amount);
    if (!amount || Number.isNaN(n) || n <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    onSubmit(sign * n);
    setAmount("");
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <Input
        type="number"
        min="0"
        step="0.01"
        placeholder="Custom amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="h-8 max-w-[140px]"
      />
      <Button size="sm" variant="secondary" onClick={() => submit(1)}>
        Add
      </Button>
      <Button size="sm" variant="outline" onClick={() => submit(-1)}>
        Remove
      </Button>
    </div>
  );
}
