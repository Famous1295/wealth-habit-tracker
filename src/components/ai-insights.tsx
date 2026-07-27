import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { getFinancialInsights } from "@/lib/insights.functions";
import { useCurrency } from "@/lib/currency-sync";

export function AIInsights() {
  const currency = useCurrency();
  const fn = useServerFn(getFinancialInsights);
  const m = useMutation({
    mutationFn: () => fn({ data: { currency } }),
  });

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> AI Financial Insights
        </CardTitle>
        <Button size="sm" variant="outline" onClick={() => m.mutate()} disabled={m.isPending}>
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${m.isPending ? "animate-spin" : ""}`} />
          {m.data ? "Refresh" : "Generate"}
        </Button>
      </CardHeader>
      <CardContent>
        {!m.data && !m.isPending && (
          <p className="text-sm text-muted-foreground">
            Get personalized, AI-powered advice on your spending, savings and habits.
          </p>
        )}
        {m.isPending && (
          <div className="space-y-2">
            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          </div>
        )}
        {m.data && (
          <div className="prose prose-sm max-w-none text-foreground">
            {renderMarkdown(m.data.insights)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function renderMarkdown(text: string) {
  const lines = text.split("\n").filter((l) => l.trim());
  return (
    <ul className="space-y-2">
      {lines.map((line, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{line.replace(/^[-*•]\s*/, "").replace(/\*\*/g, "")}</span>
        </li>
      ))}
    </ul>
  );
}
