import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type InsightInput = { currency?: string };

export const getFinancialInsights = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: InsightInput) => v ?? {})
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const [expensesR, incomesR, goalsR, habitsR, logsR, investmentsR] = await Promise.all([
      supabase.from("expenses").select("*").eq("user_id", userId),
      supabase.from("incomes").select("*").eq("user_id", userId),
      supabase.from("savings_goals").select("*").eq("user_id", userId),
      supabase.from("habits").select("*").eq("user_id", userId),
      supabase.from("habit_logs").select("*").eq("user_id", userId),
      supabase.from("investments").select("*").eq("user_id", userId),
    ]);

    const expenses = expensesR.data ?? [];
    const incomes = incomesR.data ?? [];
    const goals = goalsR.data ?? [];
    const habits = habitsR.data ?? [];
    const logs = logsR.data ?? [];
    const investments = investmentsR.data ?? [];

    const totalIncome = incomes.reduce((s, r) => s + Number(r.amount), 0);
    const totalExpense = expenses.reduce((s, r) => s + Number(r.amount), 0);
    const byCat: Record<string, number> = {};
    expenses.forEach((e) => {
      byCat[e.category] = (byCat[e.category] ?? 0) + Number(e.amount);
    });
    const invested = investments.reduce((s, r) => s + Number(r.invested_amount), 0);
    const currentVal = investments.reduce((s, r) => s + Number(r.current_value), 0);

    const summary = {
      currency: data.currency ?? "USD",
      total_income: totalIncome,
      total_expense: totalExpense,
      net_savings: totalIncome - totalExpense,
      savings_rate_pct: totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0,
      top_categories: Object.entries(byCat)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([k, v]) => ({ category: k, amount: v })),
      investment_return_pct: invested > 0 ? Math.round(((currentVal - invested) / invested) * 100) : 0,
      goal_count: goals.length,
      goals_summary: goals.slice(0, 5).map((g) => ({
        name: g.name,
        progress_pct: Math.round((Number(g.saved_amount) / Number(g.target_amount)) * 100),
      })),
      habit_count: habits.length,
      logs_last_30_days: logs.filter((l) => {
        const d = new Date(l.logged_on);
        return d >= new Date(Date.now() - 30 * 86400000);
      }).length,
    };

    // Bring your own OpenAI-compatible provider (OpenAI, OpenRouter, Groq, etc).
    // Set AI_API_KEY, and optionally AI_API_BASE_URL / AI_MODEL if you're not using
    // OpenAI directly.
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return { insights: "AI insights are unavailable — AI_API_KEY is not configured." };
    }
    const baseUrl = process.env.AI_API_BASE_URL ?? "https://api.openai.com/v1";
    const model = process.env.AI_MODEL ?? "gpt-4o-mini";

    const prompt = `You are a friendly personal finance coach. Give the user 3-5 short, specific, actionable insights based on this JSON snapshot of their finances and habits. Use plain language, no jargon. Reference concrete numbers. Format as a markdown bullet list. Currency is ${summary.currency}.\n\nData:\n${JSON.stringify(summary, null, 2)}`;

    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: "You are a helpful, concise personal finance and habit coach." },
            { role: "user", content: prompt },
          ],
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        return { insights: `AI service error (${res.status}). Try again in a moment.\n\n${text.slice(0, 200)}` };
      }
      const json = await res.json();
      const text: string = json.choices?.[0]?.message?.content ?? "No insights returned.";
      return { insights: text, summary };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      return { insights: `Could not reach AI service: ${msg}` };
    }
  });
