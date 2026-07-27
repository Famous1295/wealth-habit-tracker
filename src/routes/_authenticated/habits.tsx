import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Flame, Plus, Trash2 } from "lucide-react";
import { format, subDays } from "date-fns";

type Freq = "daily" | "weekly" | "monthly";

export const Route = createFileRoute("/_authenticated/habits")({
  head: () => ({
    meta: [
      { title: "Habits — WealthPulse" },
      { name: "description", content: "Build wealth-growing habits with streaks." },
    ],
  }),
  component: HabitsPage,
});

function HabitsPage() {
  const { user } = useAuth();
  const uid = user!.id;
  const qc = useQueryClient();

  const habitsQ = useQuery({
    queryKey: ["habits", uid],
    queryFn: async () =>
      (await supabase.from("habits").select("*").eq("user_id", uid).order("created_at", { ascending: false })).data ?? [],
  });
  const logsQ = useQuery({
    queryKey: ["habit_logs", uid],
    queryFn: async () =>
      (await supabase.from("habit_logs").select("*").eq("user_id", uid)).data ?? [],
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Freq>("daily");

  const addHabit = useMutation({
    mutationFn: async () => {
      const trimmed = name.trim();
      if (!trimmed) throw new Error("Habit name is required");
      if (trimmed.length > 100) throw new Error("Name too long");
      const { error } = await supabase.from("habits").insert({
        user_id: uid,
        name: trimmed,
        description: description.trim() || null,
        frequency,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Habit added");
      setName("");
      setDescription("");
      qc.invalidateQueries({ queryKey: ["habits", uid] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleLog = useMutation({
    mutationFn: async ({ habit_id, day, existingId }: { habit_id: string; day: string; existingId?: string }) => {
      if (existingId) {
        const { error } = await supabase.from("habit_logs").delete().eq("id", existingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("habit_logs")
          .insert({ user_id: uid, habit_id, logged_on: day });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["habit_logs", uid] });
      qc.invalidateQueries({ queryKey: ["dashboard", uid] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeHabit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("habits").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Habit removed");
      qc.invalidateQueries({ queryKey: ["habits", uid] });
      qc.invalidateQueries({ queryKey: ["habit_logs", uid] });
    },
  });

  const habits = habitsQ.data ?? [];
  const logs = logsQ.data ?? [];
  const today = format(new Date(), "yyyy-MM-dd");
  const last14 = Array.from({ length: 14 }).map((_, i) => format(subDays(new Date(), 13 - i), "yyyy-MM-dd"));

  function streakOf(habit_id: string) {
    const days = new Set(logs.filter((l) => l.habit_id === habit_id).map((l) => l.logged_on));
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = format(subDays(new Date(), i), "yyyy-MM-dd");
      if (days.has(d)) streak++;
      else break;
    }
    return streak;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Financial habits</h1>
        <p className="mt-1 text-muted-foreground">
          Save daily. Track weekly. Invest monthly. Small acts compound.
        </p>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>New habit</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addHabit.mutate();
            }}
            className="grid gap-4 md:grid-cols-4"
          >
            <div className="md:col-span-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Save $10 today" maxLength={100} required />
            </div>
            <div>
              <Label>Frequency</Label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Freq)}
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={addHabit.isPending} className="w-full gradient-primary">
                <Plus className="mr-1 h-4 w-4" /> Add
              </Button>
            </div>
            <div className="md:col-span-4">
              <Label>Description (optional)</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Why does this habit matter?" maxLength={200} />
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {habits.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Start with something small: <em>“Track today’s expenses”</em> or <em>“Save $5”</em>.
            </CardContent>
          </Card>
        )}
        {habits.map((h) => {
          const habitLogs = logs.filter((l) => l.habit_id === h.id);
          const streak = streakOf(h.id);
          const todayLog = habitLogs.find((l) => l.logged_on === today);
          return (
            <Card key={h.id} className="shadow-soft">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base sm:text-lg font-semibold break-words">{h.name}</h3>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                        {h.frequency}
                      </span>
                    </div>
                    {h.description && <p className="mt-1 text-sm text-muted-foreground break-words">{h.description}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                      <Flame className="h-4 w-4" /> {streak}
                    </div>
                    <Button
                      size="sm"
                      variant={todayLog ? "secondary" : "default"}
                      className={todayLog ? "" : "gradient-primary"}
                      onClick={() => toggleLog.mutate({ habit_id: h.id, day: today, existingId: todayLog?.id })}
                    >
                      <Check className="mr-1 h-4 w-4" /> {todayLog ? "Done" : "Mark done"}
                    </Button>
                    <button
                      onClick={() => removeHabit.mutate(h.id)}
                      className="rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-14 gap-1" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
                  {last14.map((d) => {
                    const done = habitLogs.some((l) => l.logged_on === d);
                    return (
                      <div
                        key={d}
                        title={d}
                        className={`aspect-square rounded ${done ? "bg-primary" : "bg-muted"}`}
                      />
                    );
                  })}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Last 14 days</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
