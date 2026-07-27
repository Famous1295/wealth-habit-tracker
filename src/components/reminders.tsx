import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CheckCircle2, Target, Repeat } from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";

export function Reminders() {
  const { user } = useAuth();
  const uid = user?.id;
  const today = format(new Date(), "yyyy-MM-dd");


  const { data } = useQuery({
    queryKey: ["reminders", uid],
    enabled: !!uid,
    queryFn: async () => {
      const id = uid!;
      const [habits, logs, goals, exp, inc] = await Promise.all([
        supabase.from("habits").select("*").eq("user_id", id),
        supabase.from("habit_logs").select("*").eq("user_id", id).eq("logged_on", today),
        supabase.from("savings_goals").select("*").eq("user_id", id),
        supabase.from("expenses").select("*").eq("user_id", id).eq("is_recurring", true),
        supabase.from("incomes").select("*").eq("user_id", id).eq("is_recurring", true),
      ]);
      return {
        habits: habits.data ?? [],
        loggedHabitIds: new Set((logs.data ?? []).map((l) => l.habit_id)),
        goals: goals.data ?? [],
        recurring: [
          ...(exp.data ?? []).map((r) => ({ ...r, kind: "expense" as const, freq: r.recurring_frequency })),
          ...(inc.data ?? []).map((r) => ({ ...r, kind: "income" as const, freq: r.recurring_frequency })),
        ],
      };
    },
  });


  if (!data) return null;

  const pendingHabits = data.habits.filter((h) => !data.loggedHabitIds.has(h.id));
  const upcomingGoals = data.goals
    .filter((g) => g.target_date)
    .map((g) => ({ ...g, daysLeft: differenceInCalendarDays(new Date(g.target_date!), new Date()) }))
    .filter((g) => g.daysLeft >= 0 && g.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const items: { icon: React.ReactNode; text: string; tone: string }[] = [];
  pendingHabits.slice(0, 4).forEach((h) =>
    items.push({
      icon: <CheckCircle2 className="h-4 w-4" />,
      text: `Log today's habit: ${h.name}`,
      tone: "text-primary",
    }),
  );
  upcomingGoals.slice(0, 3).forEach((g) =>
    items.push({
      icon: <Target className="h-4 w-4" />,
      text: `${g.name} due in ${g.daysLeft} day${g.daysLeft === 1 ? "" : "s"}`,
      tone: "text-warning",
    }),
  );
  data.recurring.slice(0, 3).forEach((r) =>
    items.push({
      icon: <Repeat className="h-4 w-4" />,
      text: `Recurring ${r.kind}: ${"category" in r ? r.category : r.source} (${r.freq})`,
      tone: "text-muted-foreground",
    }),
  );

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" /> Reminders
          {items.length > 0 && (
            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {items.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">All caught up — nice work! 🎉</p>
        ) : (
          <ul className="space-y-2">
            {items.map((it, i) => (
              <li key={i} className={`flex items-start gap-2 text-sm ${it.tone}`}>
                <span className="shrink-0 mt-0.5">{it.icon}</span>
                <span className="min-w-0 flex-1 break-words text-foreground">{it.text}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
