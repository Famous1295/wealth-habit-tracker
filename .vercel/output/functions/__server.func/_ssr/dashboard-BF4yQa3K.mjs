import { i as __toESM } from "../_runtime.mjs";
import { O as isRedirect, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as formatCurrency } from "./format-CUlL4Oov.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BXjpJ96D.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWb7Nc4C.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { O as Bell, S as CircleCheck, a as TrendingDown, c as Sparkles, d as Repeat, h as PiggyBank, i as TrendingUp, n as Wallet, p as RefreshCw, s as Target, y as Flame } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-BZaQbCef.mjs";
import { n as useAuth } from "./auth-context-J0MGvtDS.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as PieChart, o as Area, r as BarChart, s as CartesianGrid, t as AreaChart, u as Cell } from "../_libs/recharts+[...].mjs";
import { a as differenceInCalendarDays, i as startOfMonth, r as format, t as subMonths } from "../_libs/date-fns.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Dv7rYwEy.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
import { n as useCurrency } from "./currency-sync-MWB7XA2f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BF4yQa3K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var getFinancialInsights = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((v) => v ?? {}).handler(createSsrRpc("ad0f1c2f01aa2ac44bd00882e4cae283132eeec37762c981363819a13c8c3fda"));
function AIInsights() {
	const currency = useCurrency();
	const fn = useServerFn(getFinancialInsights);
	const m = useMutation({ mutationFn: () => fn({ data: { currency } }) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex-row items-center justify-between space-y-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), " AI Financial Insights"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => m.mutate(),
				disabled: m.isPending,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `mr-1.5 h-3.5 w-3.5 ${m.isPending ? "animate-spin" : ""}` }), m.data ? "Refresh" : "Generate"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
			!m.data && !m.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Get personalized, AI-powered advice on your spending, savings and habits."
			}),
			m.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3/4 animate-pulse rounded bg-muted" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-full animate-pulse rounded bg-muted" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-5/6 animate-pulse rounded bg-muted" })
				]
			}),
			m.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "prose prose-sm max-w-none text-foreground",
				children: renderMarkdown(m.data.insights)
			})
		] })]
	});
}
function renderMarkdown(text) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: text.split("\n").filter((l) => l.trim()).map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex gap-2 text-sm leading-relaxed",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: line.replace(/^[-*•]\s*/, "").replace(/\*\*/g, "") })]
		}, i))
	});
}
function Reminders() {
	const { user } = useAuth();
	const uid = user?.id;
	const today = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
	const { data } = useQuery({
		queryKey: ["reminders", uid],
		enabled: !!uid,
		queryFn: async () => {
			const id = uid;
			const [habits, logs, goals, exp, inc] = await Promise.all([
				supabase.from("habits").select("*").eq("user_id", id),
				supabase.from("habit_logs").select("*").eq("user_id", id).eq("logged_on", today),
				supabase.from("savings_goals").select("*").eq("user_id", id),
				supabase.from("expenses").select("*").eq("user_id", id).eq("is_recurring", true),
				supabase.from("incomes").select("*").eq("user_id", id).eq("is_recurring", true)
			]);
			return {
				habits: habits.data ?? [],
				loggedHabitIds: new Set((logs.data ?? []).map((l) => l.habit_id)),
				goals: goals.data ?? [],
				recurring: [...(exp.data ?? []).map((r) => ({
					...r,
					kind: "expense",
					freq: r.recurring_frequency
				})), ...(inc.data ?? []).map((r) => ({
					...r,
					kind: "income",
					freq: r.recurring_frequency
				}))]
			};
		}
	});
	if (!data) return null;
	const pendingHabits = data.habits.filter((h) => !data.loggedHabitIds.has(h.id));
	const upcomingGoals = data.goals.filter((g) => g.target_date).map((g) => ({
		...g,
		daysLeft: differenceInCalendarDays(new Date(g.target_date), /* @__PURE__ */ new Date())
	})).filter((g) => g.daysLeft >= 0 && g.daysLeft <= 30).sort((a, b) => a.daysLeft - b.daysLeft);
	const items = [];
	pendingHabits.slice(0, 4).forEach((h) => items.push({
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }),
		text: `Log today's habit: ${h.name}`,
		tone: "text-primary"
	}));
	upcomingGoals.slice(0, 3).forEach((g) => items.push({
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4" }),
		text: `${g.name} due in ${g.daysLeft} day${g.daysLeft === 1 ? "" : "s"}`,
		tone: "text-warning"
	}));
	data.recurring.slice(0, 3).forEach((r) => items.push({
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "h-4 w-4" }),
		text: `Recurring ${r.kind}: ${"category" in r ? r.category : r.source} (${r.freq})`,
		tone: "text-muted-foreground"
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4 text-primary" }),
				" Reminders",
				items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary",
					children: items.length
				})
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "All caught up — nice work! 🎉"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: `flex items-start gap-2 text-sm ${it.tone}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 mt-0.5",
					children: it.icon
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 flex-1 break-words text-foreground",
					children: it.text
				})]
			}, i))
		}) })]
	});
}
function Dashboard() {
	const { user, loading } = useAuth();
	const uid = user?.id;
	const { data } = useQuery({
		queryKey: ["dashboard", uid],
		enabled: !!uid,
		queryFn: async () => {
			const id = uid;
			const [incomes, expenses, goals, investments, habits, logs] = await Promise.all([
				supabase.from("incomes").select("*").eq("user_id", id).order("received_on", { ascending: false }),
				supabase.from("expenses").select("*").eq("user_id", id).order("spent_on", { ascending: false }),
				supabase.from("savings_goals").select("*").eq("user_id", id),
				supabase.from("investments").select("*").eq("user_id", id),
				supabase.from("habits").select("*").eq("user_id", id),
				supabase.from("habit_logs").select("*").eq("user_id", id)
			]);
			return {
				incomes: incomes.data ?? [],
				expenses: expenses.data ?? [],
				goals: goals.data ?? [],
				investments: investments.data ?? [],
				habits: habits.data ?? [],
				logs: logs.data ?? []
			};
		}
	});
	if (loading || !uid || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingBlock, {});
	const totalIncome = data.incomes.reduce((s, r) => s + Number(r.amount), 0);
	const totalExpense = data.expenses.reduce((s, r) => s + Number(r.amount), 0);
	const totalSavings = totalIncome - totalExpense;
	const netWorth = totalSavings + data.investments.reduce((s, r) => s + Number(r.current_value), 0);
	const trend = Array.from({ length: 6 }).map((_, i) => {
		const d = startOfMonth(subMonths(/* @__PURE__ */ new Date(), 5 - i));
		return {
			d,
			label: format(d, "MMM")
		};
	}).map(({ d, label }) => {
		const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
		const inc = data.incomes.filter((r) => new Date(r.received_on) >= d && new Date(r.received_on) < nextMonth).reduce((s, r) => s + Number(r.amount), 0);
		const exp = data.expenses.filter((r) => new Date(r.spent_on) >= d && new Date(r.spent_on) < nextMonth).reduce((s, r) => s + Number(r.amount), 0);
		return {
			month: label,
			income: inc,
			expense: exp,
			saved: inc - exp
		};
	});
	const byCat = /* @__PURE__ */ new Map();
	data.expenses.forEach((r) => byCat.set(r.category, (byCat.get(r.category) ?? 0) + Number(r.amount)));
	const catData = Array.from(byCat.entries()).map(([name, value]) => ({
		name,
		value
	}));
	const COLORS = [
		"hsl(292 76% 50%)",
		"hsl(292 60% 70%)",
		"hsl(155 55% 55%)",
		"hsl(75 75% 60%)",
		"hsl(27 80% 60%)",
		"hsl(210 70% 55%)",
		"hsl(340 70% 60%)"
	];
	const habitStats = data.habits.map((h) => {
		const days = data.logs.filter((l) => l.habit_id === h.id).map((l) => l.logged_on).sort();
		let streak = 0;
		const today = /* @__PURE__ */ new Date();
		for (let i = 0; i < 365; i++) {
			const target = new Date(today);
			target.setDate(target.getDate() - i);
			const key = format(target, "yyyy-MM-dd");
			if (days.includes(key)) streak++;
			else break;
		}
		return {
			name: h.name,
			streak,
			total: days.length
		};
	});
	const bestStreak = habitStats.reduce((m, h) => Math.max(m, h.streak), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 sm:space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl font-bold",
				children: "Your financial pulse"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm sm:text-base text-muted-foreground",
				children: "A live snapshot of your income, spending, and wealth growth."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" }),
						label: "Total income",
						value: formatCurrency(totalIncome),
						accent: "text-success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-5 w-5" }),
						label: "Total expenses",
						value: formatCurrency(totalExpense),
						accent: "text-destructive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiggyBank, { className: "h-5 w-5" }),
						label: "Net savings",
						value: formatCurrency(totalSavings),
						accent: totalSavings >= 0 ? "text-primary" : "text-destructive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" }),
						label: "Net worth",
						value: formatCurrency(netWorth),
						accent: "text-primary",
						highlight: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIInsights, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reminders, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Income vs Expenses (6 months)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 sm:h-72 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: trend,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "inc",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "var(--color-primary)",
										stopOpacity: .5
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "var(--color-primary)",
										stopOpacity: .05
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "exp",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "var(--color-destructive)",
										stopOpacity: .4
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "var(--color-destructive)",
										stopOpacity: .05
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "var(--color-border)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									tick: { fontSize: 12 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 12 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--color-card)",
									border: "1px solid var(--color-border)",
									borderRadius: 8
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "income",
									stroke: "var(--color-primary)",
									fill: "url(#inc)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "expense",
									stroke: "var(--color-destructive)",
									fill: "url(#exp)"
								})
							]
						}) })
					}) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Spending by category" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: catData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyBlock, { children: "No expenses yet." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 sm:h-72 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: catData,
							dataKey: "value",
							innerRadius: 50,
							outerRadius: 90,
							paddingAngle: 2,
							children: catData.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							contentStyle: {
								background: "var(--color-card)",
								border: "1px solid var(--color-border)",
								borderRadius: 8
							},
							formatter: (v) => formatCurrency(v)
						})] }) })
					}) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-primary" }), " Best habit streak"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-4xl sm:text-5xl font-bold text-primary",
							children: bestStreak
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "consecutive days"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-2",
							children: [habitStats.slice(0, 4).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: h.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-primary",
									children: [h.streak, "🔥"]
								})]
							}, h.name)), habitStats.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyBlock, { children: "No habits yet." })]
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-primary" }), " Savings goals progress"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [data.goals.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyBlock, { children: "Set your first savings goal." }), data.goals.slice(0, 4).map((g) => {
							const pct = Math.min(100, Number(g.saved_amount) / Number(g.target_amount) * 100);
							const daysLeft = g.target_date ? differenceInCalendarDays(new Date(g.target_date), /* @__PURE__ */ new Date()) : null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: g.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											formatCurrency(Number(g.saved_amount)),
											" / ",
											formatCurrency(Number(g.target_amount))
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: pct }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex justify-between text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [pct.toFixed(0), "% complete"] }), daysLeft !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: daysLeft > 0 ? `${daysLeft} days left` : "Due" })]
								})
							] }, g.id);
						})]
					})]
				})]
			}),
			data.investments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Investment portfolio" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56 sm:h-64 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: data.investments.map((i) => ({
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
								tick: { fontSize: 12 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 12 } }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--color-card)",
									border: "1px solid var(--color-border)",
									borderRadius: 8
								},
								formatter: (v) => formatCurrency(v)
							}),
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
			})
		]
	});
}
function StatCard({ icon, label, value, accent, highlight }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: highlight ? "shadow-elegant gradient-primary text-primary-foreground border-none" : "shadow-soft",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-4 sm:p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wider ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0",
					children: icon
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: label
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mt-2 font-display text-xl sm:text-2xl lg:text-3xl font-bold break-words ${highlight ? "" : accent}`,
				children: value
			})]
		})
	});
}
function EmptyBlock({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
		children
	});
}
function LoadingBlock() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground",
		children: "Loading your financial pulse…"
	});
}
//#endregion
export { Dashboard as component };
