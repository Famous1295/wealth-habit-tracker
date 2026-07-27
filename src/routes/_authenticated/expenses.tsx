import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { EXPENSE_CATEGORIES, INCOME_SOURCES, formatCurrency, formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, ArrowDownCircle, ArrowUpCircle, Download } from "lucide-react";
import { downloadCSV } from "@/lib/csv";

type Recurrence = "daily" | "weekly" | "monthly" | "yearly";

const recordSchema = z.object({
  category: z.string().trim().min(1).max(50),
  amount: z.number().positive("Amount must be > 0").max(1_000_000_000),
  date: z.string(),
  note: z.string().trim().max(500).optional(),
  is_recurring: z.boolean().optional(),
  recurring_frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).nullable().optional(),
});


export const Route = createFileRoute("/_authenticated/expenses")({
  head: () => ({
    meta: [
      { title: "Expenses & Income — WealthPulse" },
      { name: "description", content: "Log income and expenses to keep your finances in check." },
    ],
  }),
  component: ExpensesPage,
});

function ExpensesPage() {
  const { user } = useAuth();
  const uid = user!.id;
  const qc = useQueryClient();

  const incomesQ = useQuery({
    queryKey: ["incomes", uid],
    queryFn: async () =>
      (await supabase.from("incomes").select("*").eq("user_id", uid).order("received_on", { ascending: false })).data ?? [],
  });
  const expensesQ = useQuery({
    queryKey: ["expenses", uid],
    queryFn: async () =>
      (await supabase.from("expenses").select("*").eq("user_id", uid).order("spent_on", { ascending: false })).data ?? [],
  });

  const addIncome = useMutation({
    mutationFn: async (v: { source: string; amount: number; date: string; note?: string; is_recurring?: boolean; recurring_frequency?: Recurrence | null }) => {
      const { error } = await supabase.from("incomes").insert({
        user_id: uid,
        source: v.source,
        amount: v.amount,
        received_on: v.date,
        note: v.note || null,
        is_recurring: !!v.is_recurring,
        recurring_frequency: v.is_recurring ? v.recurring_frequency ?? "monthly" : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Income added");
      qc.invalidateQueries({ queryKey: ["incomes", uid] });
      qc.invalidateQueries({ queryKey: ["dashboard", uid] });
      qc.invalidateQueries({ queryKey: ["reminders", uid] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addExpense = useMutation({
    mutationFn: async (v: { category: string; amount: number; date: string; note?: string; is_recurring?: boolean; recurring_frequency?: Recurrence | null }) => {
      const { error } = await supabase.from("expenses").insert({
        user_id: uid,
        category: v.category,
        amount: v.amount,
        spent_on: v.date,
        note: v.note || null,
        is_recurring: !!v.is_recurring,
        recurring_frequency: v.is_recurring ? v.recurring_frequency ?? "monthly" : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Expense logged");
      qc.invalidateQueries({ queryKey: ["expenses", uid] });
      qc.invalidateQueries({ queryKey: ["dashboard", uid] });
      qc.invalidateQueries({ queryKey: ["reminders", uid] });
    },
    onError: (e: Error) => toast.error(e.message),
  });


  const del = useMutation({
    mutationFn: async ({ table, id }: { table: "incomes" | "expenses"; id: string }) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, v) => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: [v.table, uid] });
      qc.invalidateQueries({ queryKey: ["dashboard", uid] });
    },
  });

  const totalIn = (incomesQ.data ?? []).reduce((s, r) => s + Number(r.amount), 0);
  const totalOut = (expensesQ.data ?? []).reduce((s, r) => s + Number(r.amount), 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Expenses & Income</h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">Log every dollar in and out.</p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
        <SummaryCard icon={<ArrowUpCircle className="h-5 w-5" />} label="Income" value={formatCurrency(totalIn)} tone="success" />
        <SummaryCard icon={<ArrowDownCircle className="h-5 w-5" />} label="Expenses" value={formatCurrency(totalOut)} tone="destructive" />
        <div className="col-span-2 lg:col-span-1">
          <SummaryCard icon={<Plus className="h-5 w-5" />} label="Net" value={formatCurrency(totalIn - totalOut)} tone={totalIn - totalOut >= 0 ? "primary" : "destructive"} />
        </div>
      </div>

      <Tabs defaultValue="expense" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="expense" className="flex-1 sm:flex-none">Expenses</TabsTrigger>
          <TabsTrigger value="income" className="flex-1 sm:flex-none">Income</TabsTrigger>
        </TabsList>

        <TabsContent value="expense" className="space-y-6 pt-6">
          <RecordForm
            title="Log an expense"
            categoryLabel="Category"
            categories={EXPENSE_CATEGORIES}
            submitLabel="Add expense"
            onSubmit={(v) => addExpense.mutate(v)}
            pending={addExpense.isPending}
          />
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              disabled={!(expensesQ.data ?? []).length}
              onClick={() =>
                downloadCSV(
                  `expenses-${new Date().toISOString().slice(0, 10)}.csv`,
                  (expensesQ.data ?? []).map((r) => ({
                    date: r.spent_on,
                    category: r.category,
                    amount: r.amount,
                    recurring: r.is_recurring ? r.recurring_frequency ?? "yes" : "no",
                    note: r.note ?? "",
                  })),
                )
              }
            >
              <Download className="mr-1 h-4 w-4" /> Export CSV
            </Button>
          </div>
          <RecordTable
            rows={expensesQ.data ?? []}
            dateKey="spent_on"
            catKey="category"
            onDelete={(id) => del.mutate({ table: "expenses", id })}
          />
        </TabsContent>

        <TabsContent value="income" className="space-y-6 pt-6">
          <RecordForm
            title="Log income"
            categoryLabel="Source"
            categories={INCOME_SOURCES}
            submitLabel="Add income"
            onSubmit={(v) =>
              addIncome.mutate({
                source: v.category,
                amount: v.amount,
                date: v.date,
                note: v.note,
                is_recurring: v.is_recurring,
                recurring_frequency: v.recurring_frequency,
              })
            }
            pending={addIncome.isPending}
          />
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              disabled={!(incomesQ.data ?? []).length}
              onClick={() =>
                downloadCSV(
                  `income-${new Date().toISOString().slice(0, 10)}.csv`,
                  (incomesQ.data ?? []).map((r) => ({
                    date: r.received_on,
                    source: r.source,
                    amount: r.amount,
                    recurring: r.is_recurring ? r.recurring_frequency ?? "yes" : "no",
                    note: r.note ?? "",
                  })),
                )
              }
            >
              <Download className="mr-1 h-4 w-4" /> Export CSV
            </Button>
          </div>
          <RecordTable
            rows={incomesQ.data ?? []}
            dateKey="received_on"
            catKey="source"
            onDelete={(id) => del.mutate({ table: "incomes", id })}
          />
        </TabsContent>

      </Tabs>
    </div>
  );
}

function SummaryCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "success" | "destructive" | "primary" }) {
  const color = tone === "success" ? "text-success" : tone === "destructive" ? "text-destructive" : "text-primary";
  return (
    <Card className="shadow-soft">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground">
          <span className="shrink-0">{icon}</span>
          <span className="truncate">{label}</span>
        </div>
        <div className={`mt-2 font-display text-lg sm:text-2xl font-bold break-words ${color}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

function RecordForm({
  title,
  categoryLabel,
  categories,
  submitLabel,
  onSubmit,
  pending,
}: {
  title: string;
  categoryLabel: string;
  categories: readonly string[];
  submitLabel: string;
  onSubmit: (v: {
    category: string;
    amount: number;
    date: string;
    note?: string;
    is_recurring?: boolean;
    recurring_frequency?: Recurrence | null;
  }) => void;
  pending: boolean;
}) {
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [freq, setFreq] = useState<Recurrence>("monthly");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = recordSchema.safeParse({ category, amount: Number(amount), date, note });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid");
      return;
    }
    onSubmit({
      category,
      amount: Number(amount),
      date,
      note: note || undefined,
      is_recurring: isRecurring,
      recurring_frequency: isRecurring ? freq : null,
    });
    setAmount("");
    setNote("");
    setIsRecurring(false);
  }

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-5">
          <div className="md:col-span-2">
            <Label>{categoryLabel}</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Amount</Label>
            <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="md:col-span-5">
            <Label>Note (optional)</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Brief note…" rows={2} maxLength={500} />
          </div>
          <div className="md:col-span-5 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-border p-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              Recurring transaction
            </label>
            {isRecurring && (
              <select
                value={freq}
                onChange={(e) => setFreq(e.target.value as Recurrence)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            )}
          </div>
          <div className="md:col-span-5">
            <Button type="submit" disabled={pending} className="gradient-primary">
              <Plus className="mr-1 h-4 w-4" /> {submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


function RecordTable<T extends { id: string; amount: number | string; note: string | null }>({
  rows,
  dateKey,
  catKey,
  onDelete,
}: {
  rows: (T & Record<string, unknown>)[];
  dateKey: string;
  catKey: string;
  onDelete: (id: string) => void;
}) {
  if (!rows.length) {
    return (
      <Card className="shadow-soft">
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          No records yet — add your first one above.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-soft">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{formatDate(String(r[dateKey]))}</TableCell>
                <TableCell className="font-medium">{String(r[catKey])}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">{r.note ?? "—"}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(Number(r.amount))}</TableCell>
                <TableCell className="text-right">
                  <button onClick={() => onDelete(r.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
