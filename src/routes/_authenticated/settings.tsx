import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { CURRENCIES, setAppCurrency } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WealthPulse" },
      { name: "description", content: "Manage your profile, currency and preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const uid = user!.id;
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["profile", uid],
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", uid).maybeSingle()).data,
  });

  const [fullName, setFullName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [monthlyIncome, setMonthlyIncome] = useState("0");

  useEffect(() => {
    if (q.data) {
      setFullName(q.data.full_name ?? "");
      setCurrency(q.data.currency ?? "USD");
      setMonthlyIncome(String(q.data.monthly_income ?? 0));
      setAppCurrency(q.data.currency ?? "USD");
    }
  }, [q.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          currency,
          monthly_income: Number(monthlyIncome) || 0,
        })
        .eq("id", uid);
      if (error) throw error;
    },
    onSuccess: () => {
      setAppCurrency(currency);
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["profile", uid] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-7 w-7 text-primary" /> Settings
        </h1>
        <p className="mt-1 text-muted-foreground">Personalize your WealthPulse experience.</p>
      </div>

      <Card className="shadow-soft max-w-2xl">
        <CardHeader>
          <CardTitle>Profile & Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate();
            }}
            className="space-y-5"
          >
            <div>
              <Label>Email</Label>
              <Input value={user?.email ?? ""} disabled />
            </div>
            <div>
              <Label>Full name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} />
            </div>
            <div>
              <Label>Preferred currency</Label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">Used throughout the app for money formatting.</p>
            </div>
            <div>
              <Label>Monthly income (optional benchmark)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={save.isPending} className="gradient-primary">
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
