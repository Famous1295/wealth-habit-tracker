import { i as __toESM } from "../_runtime.mjs";
import { a as formatCurrency, i as INVESTMENT_TYPES, o as formatDate } from "./format-CUlL4Oov.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BXjpJ96D.mjs";
import { n as Label, t as Input } from "./label-N2deYTEC.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Briefcase, a as TrendingDown, i as TrendingUp, m as Plus, o as Trash2 } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-BZaQbCef.mjs";
import { n as useAuth } from "./auth-context-J0MGvtDS.mjs";
import { d as ResponsiveContainer, f as Tooltip, l as Pie, n as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
import { a as stringType, i as objectType, r as numberType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/investments-DYAqOT0q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	name: stringType().trim().min(1).max(80),
	asset_type: stringType().trim().min(1),
	invested_amount: numberType().nonnegative().max(0xe8d4a51000),
	current_value: numberType().nonnegative().max(0xe8d4a51000),
	purchased_on: stringType()
});
var COLORS = [
	"hsl(292 76% 50%)",
	"hsl(292 60% 70%)",
	"hsl(155 55% 55%)",
	"hsl(75 75% 60%)",
	"hsl(27 80% 60%)",
	"hsl(210 70% 55%)",
	"hsl(340 70% 60%)"
];
function InvestmentsPage() {
	const { user } = useAuth();
	const uid = user.id;
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["investments", uid],
		queryFn: async () => (await supabase.from("investments").select("*").eq("user_id", uid).order("purchased_on", { ascending: false })).data ?? []
	});
	const add = useMutation({
		mutationFn: async (v) => {
			const { error } = await supabase.from("investments").insert({
				...v,
				user_id: uid
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Investment added");
			qc.invalidateQueries({ queryKey: ["investments", uid] });
			qc.invalidateQueries({ queryKey: ["dashboard", uid] });
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("investments").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Removed");
			qc.invalidateQueries({ queryKey: ["investments", uid] });
			qc.invalidateQueries({ queryKey: ["dashboard", uid] });
		}
	});
	const rows = q.data ?? [];
	const invested = rows.reduce((s, r) => s + Number(r.invested_amount), 0);
	const currentVal = rows.reduce((s, r) => s + Number(r.current_value), 0);
	const gain = currentVal - invested;
	const gainPct = invested > 0 ? gain / invested * 100 : 0;
	const allocation = /* @__PURE__ */ new Map();
	rows.forEach((r) => allocation.set(r.asset_type, (allocation.get(r.asset_type) ?? 0) + Number(r.current_value)));
	const pieData = Array.from(allocation.entries()).map(([name, value]) => ({
		name,
		value
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 sm:space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl font-bold",
				children: "Investment Portfolio"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm sm:text-base text-muted-foreground",
				children: "Track holdings, returns and asset allocation."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-5 w-5" }),
						label: "Invested",
						value: formatCurrency(invested)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" }),
						label: "Current value",
						value: formatCurrency(currentVal),
						accent: "text-primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: gain >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-5 w-5" }),
						label: "Total gain/loss",
						value: formatCurrency(gain),
						accent: gain >= 0 ? "text-success" : "text-destructive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" }),
						label: "Return %",
						value: `${gainPct >= 0 ? "+" : ""}${gainPct.toFixed(2)}%`,
						accent: gainPct >= 0 ? "text-success" : "text-destructive"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Add investment" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvestmentForm, {
						onSubmit: (v) => add.mutate(v),
						pending: add.isPending
					}) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Allocation" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: pieData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Add investments to see allocation."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: pieData,
							dataKey: "value",
							innerRadius: 40,
							outerRadius: 80,
							paddingAngle: 2,
							children: pieData.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => formatCurrency(v) })] }) })
					}) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Holdings" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-8 text-center text-sm text-muted-foreground",
						children: "No investments yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Name" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Type" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Purchased" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Invested"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Current"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "P/L"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: rows.map((r) => {
						const pl = Number(r.current_value) - Number(r.invested_amount);
						const pct = Number(r.invested_amount) > 0 ? pl / Number(r.invested_amount) * 100 : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-medium",
								children: r.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.asset_type }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(r.purchased_on) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right font-mono",
								children: formatCurrency(Number(r.invested_amount))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right font-mono",
								children: formatCurrency(Number(r.current_value))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								className: `text-right font-mono ${pl >= 0 ? "text-success" : "text-destructive"}`,
								children: [
									pl >= 0 ? "+" : "",
									formatCurrency(pl),
									" (",
									pct.toFixed(1),
									"%)"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => del.mutate(r.id),
									className: "rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})
							})
						] }, r.id);
					}) })] })
				})]
			})
		]
	});
}
function StatCard({ icon, label, value, accent = "" }) {
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
				className: `mt-2 font-display text-lg sm:text-2xl font-bold break-words ${accent}`,
				children: value
			})]
		})
	});
}
function InvestmentForm({ onSubmit, pending }) {
	const [name, setName] = (0, import_react.useState)("");
	const [assetType, setAssetType] = (0, import_react.useState)(INVESTMENT_TYPES[0]);
	const [invested, setInvested] = (0, import_react.useState)("");
	const [current, setCurrent] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	function submit(e) {
		e.preventDefault();
		const parsed = schema.safeParse({
			name,
			asset_type: assetType,
			invested_amount: Number(invested),
			current_value: Number(current || invested),
			purchased_on: date
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sm:col-span-2 md:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "e.g. Apple Stock",
					required: true,
					maxLength: 80
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				value: assetType,
				onChange: (e) => setAssetType(e.target.value),
				className: "mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
				children: INVESTMENT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Invested" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				min: "0",
				step: "0.01",
				value: invested,
				onChange: (e) => setInvested(e.target.value),
				placeholder: "0.00",
				required: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Current value" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				min: "0",
				step: "0.01",
				value: current,
				onChange: (e) => setCurrent(e.target.value),
				placeholder: "0.00"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Purchased" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "date",
				value: date,
				onChange: (e) => setDate(e.target.value),
				required: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sm:col-span-2 md:col-span-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					disabled: pending,
					className: "w-full sm:w-auto gradient-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Add investment"]
				})
			})
		]
	});
}
//#endregion
export { InvestmentsPage as component };
