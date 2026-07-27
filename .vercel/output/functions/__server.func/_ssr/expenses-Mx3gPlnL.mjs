import { i as __toESM } from "../_runtime.mjs";
import { a as formatCurrency, n as EXPENSE_CATEGORIES, o as formatDate, r as INCOME_SOURCES } from "./format-CUlL4Oov.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BXjpJ96D.mjs";
import { n as Label, t as Input } from "./label-N2deYTEC.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as CircleArrowUp, b as Download, m as Plus, o as Trash2, w as CircleArrowDown } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-BZaQbCef.mjs";
import { n as useAuth } from "./auth-context-J0MGvtDS.mjs";
import { a as stringType, i as objectType, n as enumType, r as numberType, t as booleanType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expenses-Mx3gPlnL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function downloadCSV(filename, rows) {
	if (!rows.length) return;
	const headers = Object.keys(rows[0]);
	const escape = (v) => {
		if (v === null || v === void 0) return "";
		const s = String(v).replace(/"/g, "\"\"");
		return /[",\n]/.test(s) ? `"${s}"` : s;
	};
	const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
	const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
var recordSchema = objectType({
	category: stringType().trim().min(1).max(50),
	amount: numberType().positive("Amount must be > 0").max(1e9),
	date: stringType(),
	note: stringType().trim().max(500).optional(),
	is_recurring: booleanType().optional(),
	recurring_frequency: enumType([
		"daily",
		"weekly",
		"monthly",
		"yearly"
	]).nullable().optional()
});
function ExpensesPage() {
	const { user } = useAuth();
	const uid = user.id;
	const qc = useQueryClient();
	const incomesQ = useQuery({
		queryKey: ["incomes", uid],
		queryFn: async () => (await supabase.from("incomes").select("*").eq("user_id", uid).order("received_on", { ascending: false })).data ?? []
	});
	const expensesQ = useQuery({
		queryKey: ["expenses", uid],
		queryFn: async () => (await supabase.from("expenses").select("*").eq("user_id", uid).order("spent_on", { ascending: false })).data ?? []
	});
	const addIncome = useMutation({
		mutationFn: async (v) => {
			const { error } = await supabase.from("incomes").insert({
				user_id: uid,
				source: v.source,
				amount: v.amount,
				received_on: v.date,
				note: v.note || null,
				is_recurring: !!v.is_recurring,
				recurring_frequency: v.is_recurring ? v.recurring_frequency ?? "monthly" : null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Income added");
			qc.invalidateQueries({ queryKey: ["incomes", uid] });
			qc.invalidateQueries({ queryKey: ["dashboard", uid] });
			qc.invalidateQueries({ queryKey: ["reminders", uid] });
		},
		onError: (e) => toast.error(e.message)
	});
	const addExpense = useMutation({
		mutationFn: async (v) => {
			const { error } = await supabase.from("expenses").insert({
				user_id: uid,
				category: v.category,
				amount: v.amount,
				spent_on: v.date,
				note: v.note || null,
				is_recurring: !!v.is_recurring,
				recurring_frequency: v.is_recurring ? v.recurring_frequency ?? "monthly" : null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Expense logged");
			qc.invalidateQueries({ queryKey: ["expenses", uid] });
			qc.invalidateQueries({ queryKey: ["dashboard", uid] });
			qc.invalidateQueries({ queryKey: ["reminders", uid] });
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: async ({ table, id }) => {
			const { error } = await supabase.from(table).delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: (_, v) => {
			toast.success("Deleted");
			qc.invalidateQueries({ queryKey: [v.table, uid] });
			qc.invalidateQueries({ queryKey: ["dashboard", uid] });
		}
	});
	const totalIn = (incomesQ.data ?? []).reduce((s, r) => s + Number(r.amount), 0);
	const totalOut = (expensesQ.data ?? []).reduce((s, r) => s + Number(r.amount), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 sm:space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl font-bold",
				children: "Expenses & Income"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm sm:text-base text-muted-foreground",
				children: "Log every dollar in and out."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowUp, { className: "h-5 w-5" }),
						label: "Income",
						value: formatCurrency(totalIn),
						tone: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowDown, { className: "h-5 w-5" }),
						label: "Expenses",
						value: formatCurrency(totalOut),
						tone: "destructive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-2 lg:col-span-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5" }),
							label: "Net",
							value: formatCurrency(totalIn - totalOut),
							tone: totalIn - totalOut >= 0 ? "primary" : "destructive"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "expense",
				className: "w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "w-full sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "expense",
							className: "flex-1 sm:flex-none",
							children: "Expenses"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "income",
							className: "flex-1 sm:flex-none",
							children: "Income"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "expense",
						className: "space-y-6 pt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordForm, {
								title: "Log an expense",
								categoryLabel: "Category",
								categories: EXPENSE_CATEGORIES,
								submitLabel: "Add expense",
								onSubmit: (v) => addExpense.mutate(v),
								pending: addExpense.isPending
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									disabled: !(expensesQ.data ?? []).length,
									onClick: () => downloadCSV(`expenses-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, (expensesQ.data ?? []).map((r) => ({
										date: r.spent_on,
										category: r.category,
										amount: r.amount,
										recurring: r.is_recurring ? r.recurring_frequency ?? "yes" : "no",
										note: r.note ?? ""
									}))),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), " Export CSV"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordTable, {
								rows: expensesQ.data ?? [],
								dateKey: "spent_on",
								catKey: "category",
								onDelete: (id) => del.mutate({
									table: "expenses",
									id
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "income",
						className: "space-y-6 pt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordForm, {
								title: "Log income",
								categoryLabel: "Source",
								categories: INCOME_SOURCES,
								submitLabel: "Add income",
								onSubmit: (v) => addIncome.mutate({
									source: v.category,
									amount: v.amount,
									date: v.date,
									note: v.note,
									is_recurring: v.is_recurring,
									recurring_frequency: v.recurring_frequency
								}),
								pending: addIncome.isPending
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									disabled: !(incomesQ.data ?? []).length,
									onClick: () => downloadCSV(`income-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, (incomesQ.data ?? []).map((r) => ({
										date: r.received_on,
										source: r.source,
										amount: r.amount,
										recurring: r.is_recurring ? r.recurring_frequency ?? "yes" : "no",
										note: r.note ?? ""
									}))),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), " Export CSV"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordTable, {
								rows: incomesQ.data ?? [],
								dateKey: "received_on",
								catKey: "source",
								onDelete: (id) => del.mutate({
									table: "incomes",
									id
								})
							})
						]
					})
				]
			})
		]
	});
}
function SummaryCard({ icon, label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-soft",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-4 sm:p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0",
					children: icon
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: label
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mt-2 font-display text-lg sm:text-2xl font-bold break-words ${tone === "success" ? "text-success" : tone === "destructive" ? "text-destructive" : "text-primary"}`,
				children: value
			})]
		})
	});
}
function RecordForm({ title, categoryLabel, categories, submitLabel, onSubmit, pending }) {
	const [category, setCategory] = (0, import_react.useState)(categories[0]);
	const [amount, setAmount] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [note, setNote] = (0, import_react.useState)("");
	const [isRecurring, setIsRecurring] = (0, import_react.useState)(false);
	const [freq, setFreq] = (0, import_react.useState)("monthly");
	function submit(e) {
		e.preventDefault();
		const parsed = recordSchema.safeParse({
			category,
			amount: Number(amount),
			date,
			note
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0]?.message ?? "Invalid");
			return;
		}
		onSubmit({
			category,
			amount: Number(amount),
			date,
			note: note || void 0,
			is_recurring: isRecurring,
			recurring_frequency: isRecurring ? freq : null
		});
		setAmount("");
		setNote("");
		setIsRecurring(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: title }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "grid gap-4 md:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: categoryLabel }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: category,
						onChange: (e) => setCategory(e.target.value),
						className: "mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
						children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					min: "0",
					step: "0.01",
					value: amount,
					onChange: (e) => setAmount(e.target.value),
					placeholder: "0.00",
					required: true
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "date",
					value: date,
					onChange: (e) => setDate(e.target.value),
					required: true
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Note (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: note,
						onChange: (e) => setNote(e.target.value),
						placeholder: "Brief note…",
						rows: 2,
						maxLength: 500
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-5 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: isRecurring,
							onChange: (e) => setIsRecurring(e.target.checked),
							className: "h-4 w-4 rounded border-input accent-primary"
						}), "Recurring transaction"]
					}), isRecurring && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: freq,
						onChange: (e) => setFreq(e.target.value),
						className: "h-9 rounded-md border border-input bg-background px-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "daily",
								children: "Daily"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "weekly",
								children: "Weekly"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "monthly",
								children: "Monthly"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "yearly",
								children: "Yearly"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: pending,
						className: "gradient-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }),
							" ",
							submitLabel
						]
					})
				})
			]
		}) })]
	});
}
function RecordTable({ rows, dateKey, catKey, onDelete }) {
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-soft",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-8 text-center text-sm text-muted-foreground",
			children: "No records yet — add your first one above."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-soft",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Category" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Note" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right",
					children: "Amount"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(String(r[dateKey])) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-medium",
					children: String(r[catKey])
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-muted-foreground max-w-xs truncate",
					children: r.note ?? "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right font-mono",
					children: formatCurrency(Number(r.amount))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onDelete(r.id),
						className: "rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
					})
				})
			] }, r.id)) })] })
		})
	});
}
//#endregion
export { ExpensesPage as component };
