import { i as __toESM } from "../_runtime.mjs";
import { a as formatCurrency, i as INVESTMENT_TYPES } from "./format-CUlL4Oov.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BXjpJ96D.mjs";
import { n as Label, t as Input } from "./label-N2deYTEC.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as TrendingDown, i as TrendingUp, m as Plus, o as Trash2 } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-BZaQbCef.mjs";
import { n as useAuth } from "./auth-context-J0MGvtDS.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as PieChart, o as Area, p as Legend, r as BarChart, s as CartesianGrid, t as AreaChart, u as Cell } from "../_libs/recharts+[...].mjs";
import { i as startOfMonth, r as format, t as subMonths } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-BTHvK1h7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"hsl(292 76% 50%)",
	"hsl(292 60% 70%)",
	"hsl(155 55% 55%)",
	"hsl(75 75% 60%)",
	"hsl(27 80% 60%)",
	"hsl(210 70% 55%)",
	"hsl(340 70% 60%)"
];
function AnalyticsPage() {
	const { user } = useAuth();
	const uid = user.id;
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["analytics", uid],
		queryFn: async () => {
			const [inc, exp, inv] = await Promise.all([
				supabase.from("incomes").select("*").eq("user_id", uid),
				supabase.from("expenses").select("*").eq("user_id", uid),
				supabase.from("investments").select("*").eq("user_id", uid).order("purchased_on", { ascending: false })
			]);
			return {
				incomes: inc.data ?? [],
				expenses: exp.data ?? [],
				investments: inv.data ?? []
			};
		}
	});
	const [name, setName] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)(INVESTMENT_TYPES[0]);
	const [investedInput, setInvestedInput] = (0, import_react.useState)("");
	const [currentInput, setCurrentInput] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const addInv = useMutation({
		mutationFn: async () => {
			if (!name.trim()) throw new Error("Name required");
			const iv = Number(investedInput);
			const cv = Number(currentInput || investedInput);
			if (!(iv >= 0)) throw new Error("Invested must be >= 0");
			const { error } = await supabase.from("investments").insert({
				user_id: uid,
				name: name.trim().slice(0, 100),
				asset_type: type,
				invested_amount: iv,
				current_value: cv,
				purchased_on: date
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Investment added");
			setName("");
			setInvestedInput("");
			setCurrentInput("");
			qc.invalidateQueries({ queryKey: ["analytics", uid] });
			qc.invalidateQueries({ queryKey: ["dashboard", uid] });
		},
		onError: (e) => toast.error(e.message)
	});
	const updateValue = useMutation({
		mutationFn: async ({ id, val }) => {
			const { error } = await supabase.from("investments").update({ current_value: val }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["analytics", uid] })
	});
	const removeInv = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("investments").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Removed");
			qc.invalidateQueries({ queryKey: ["analytics", uid] });
			qc.invalidateQueries({ queryKey: ["dashboard", uid] });
		}
	});
	if (!q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 text-muted-foreground",
		children: "Loading…"
	});
	const { incomes, expenses, investments } = q.data;
	const invested = investments.reduce((s, i) => s + Number(i.invested_amount), 0);
	const currentVal = investments.reduce((s, i) => s + Number(i.current_value), 0);
	const gain = currentVal - invested;
	const gainPct = invested > 0 ? gain / invested * 100 : 0;
	const trend = Array.from({ length: 12 }).map((_, i) => startOfMonth(subMonths(/* @__PURE__ */ new Date(), 11 - i))).map((d) => {
		const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
		const savedUpTo = incomes.filter((r) => new Date(r.received_on) < nextMonth).reduce((s, r) => s + Number(r.amount), 0) - expenses.filter((r) => new Date(r.spent_on) < nextMonth).reduce((s, r) => s + Number(r.amount), 0);
		const investedUpTo = investments.filter((i) => new Date(i.purchased_on) < nextMonth).reduce((s, i) => s + Number(i.current_value), 0);
		return {
			month: format(d, "MMM"),
			netWorth: savedUpTo + investedUpTo,
			saved: savedUpTo,
			invested: investedUpTo
		};
	});
	const alloc = /* @__PURE__ */ new Map();
	investments.forEach((i) => alloc.set(i.asset_type, (alloc.get(i.asset_type) ?? 0) + Number(i.current_value)));
	const allocData = Array.from(alloc.entries()).map(([name, value]) => ({
		name,
		value
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 sm:space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl font-bold",
				children: "Wealth analytics"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm sm:text-base text-muted-foreground",
				children: "Investments, allocation, and net-worth growth over time."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground truncate",
								children: "Invested"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-display text-lg sm:text-2xl font-bold break-words",
								children: formatCurrency(invested)
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground truncate",
								children: "Current value"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-display text-lg sm:text-2xl font-bold text-primary break-words",
								children: formatCurrency(currentVal)
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-soft col-span-2 lg:col-span-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground truncate",
								children: "Gain / loss"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-lg sm:text-2xl font-bold break-words ${gain >= 0 ? "text-success" : "text-destructive"}`,
								children: [
									gain >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-5 w-5 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatCurrency(gain) }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs sm:text-sm font-normal",
										children: [
											"(",
											gainPct.toFixed(1),
											"%)"
										]
									})
								]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Net worth trend (12 months)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64 sm:h-80",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data: trend,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "nw",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "var(--color-primary)",
									stopOpacity: .6
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "var(--color-primary)",
									stopOpacity: .05
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "var(--color-border)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "month",
								tick: { fontSize: 12 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 12 } }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								formatter: (v) => formatCurrency(v),
								contentStyle: {
									background: "var(--color-card)",
									border: "1px solid var(--color-border)",
									borderRadius: 8
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "netWorth",
								name: "Net worth",
								stroke: "var(--color-primary)",
								fill: "url(#nw)",
								strokeWidth: 2
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "saved",
								name: "Savings",
								stroke: "var(--color-primary-glow)",
								fill: "transparent",
								strokeWidth: 2
							})
						]
					}) })
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Portfolio allocation" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: allocData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-8 text-center text-sm text-muted-foreground",
						children: "Add investments to see allocation."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: allocData,
								dataKey: "value",
								nameKey: "name",
								innerRadius: 50,
								outerRadius: 95,
								paddingAngle: 2,
								children: allocData.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								formatter: (v) => formatCurrency(v),
								contentStyle: {
									background: "var(--color-card)",
									border: "1px solid var(--color-border)",
									borderRadius: 8
								}
							})
						] }) })
					}) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Invested vs current" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: investments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-8 text-center text-sm text-muted-foreground",
						children: "Nothing to compare yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: investments.map((i) => ({
								name: i.name,
								invested: Number(i.invested_amount),
								current: Number(i.current_value)
							})),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "var(--color-border)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 12 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (v) => formatCurrency(v),
									contentStyle: {
										background: "var(--color-card)",
										border: "1px solid var(--color-border)",
										borderRadius: 8
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "invested",
									fill: "var(--color-primary-glow)",
									radius: [
										6,
										6,
										0,
										0
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "current",
									fill: "var(--color-primary)",
									radius: [
										6,
										6,
										0,
										0
									]
								})
							]
						}) })
					}) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Add an investment" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						addInv.mutate();
					},
					className: "grid gap-4 md:grid-cols-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Apple stock",
								maxLength: 100,
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: type,
							onChange: (e) => setType(e.target.value),
							className: "mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
							children: INVESTMENT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Invested" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0",
							step: "0.01",
							value: investedInput,
							onChange: (e) => setInvestedInput(e.target.value),
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Current value" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0",
							step: "0.01",
							value: currentInput,
							onChange: (e) => setCurrentInput(e.target.value),
							placeholder: "Same as invested"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Purchased" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value),
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: addInv.isPending,
								className: "gradient-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Add investment"]
							})
						})
					]
				}) })]
			}),
			investments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your investments" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-3",
					children: investments.map((i) => {
						const g = Number(i.current_value) - Number(i.invested_amount);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-semibold break-words",
									children: [
										i.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-2 inline-block rounded bg-secondary px-2 py-0.5 text-xs",
											children: i.asset_type
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground break-words",
									children: [
										"Invested ",
										formatCurrency(Number(i.invested_amount)),
										" · ",
										i.purchased_on
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 sm:gap-3 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										step: "0.01",
										defaultValue: Number(i.current_value),
										onBlur: (e) => {
											const v = Number(e.target.value);
											if (v >= 0 && v !== Number(i.current_value)) updateValue.mutate({
												id: i.id,
												val: v
											});
										},
										className: "w-24 sm:w-32"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-mono text-sm ${g >= 0 ? "text-success" : "text-destructive"}`,
										children: [g >= 0 ? "+" : "", formatCurrency(g)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => removeInv.mutate(i.id),
										className: "rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})
								]
							})]
						}, i.id);
					})
				})]
			})
		]
	});
}
//#endregion
export { AnalyticsPage as component };
