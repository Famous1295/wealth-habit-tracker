import { i as __toESM } from "../_runtime.mjs";
import { a as formatCurrency, o as formatDate } from "./format-CUlL4Oov.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BXjpJ96D.mjs";
import { n as Label, t as Input } from "./label-N2deYTEC.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as TrendingUp, m as Plus, o as Trash2, s as Target } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-BZaQbCef.mjs";
import { n as useAuth } from "./auth-context-J0MGvtDS.mjs";
import { a as differenceInCalendarDays } from "../_libs/date-fns.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/goals-DyFdlWXA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GoalsPage() {
	const { user } = useAuth();
	const uid = user.id;
	const qc = useQueryClient();
	const goalsQ = useQuery({
		queryKey: ["goals", uid],
		queryFn: async () => (await supabase.from("savings_goals").select("*").eq("user_id", uid).order("created_at", { ascending: false })).data ?? []
	});
	const [name, setName] = (0, import_react.useState)("");
	const [target, setTarget] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)("");
	const [targetDate, setTargetDate] = (0, import_react.useState)("");
	const addGoal = useMutation({
		mutationFn: async () => {
			if (!name.trim()) throw new Error("Name is required");
			const t = Number(target);
			const s = Number(saved || 0);
			if (!(t > 0)) throw new Error("Target amount must be > 0");
			if (s < 0) throw new Error("Saved must be >= 0");
			const { error } = await supabase.from("savings_goals").insert({
				user_id: uid,
				name: name.trim().slice(0, 100),
				target_amount: t,
				saved_amount: s,
				target_date: targetDate || null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Goal created");
			setName("");
			setTarget("");
			setSaved("");
			setTargetDate("");
			qc.invalidateQueries({ queryKey: ["goals", uid] });
			qc.invalidateQueries({ queryKey: ["dashboard", uid] });
		},
		onError: (e) => toast.error(e.message)
	});
	const contribute = useMutation({
		mutationFn: async ({ id, delta, current }) => {
			const { error } = await supabase.from("savings_goals").update({ saved_amount: Math.max(0, current + delta) }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["goals", uid] });
			qc.invalidateQueries({ queryKey: ["dashboard", uid] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("savings_goals").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Goal removed");
			qc.invalidateQueries({ queryKey: ["goals", uid] });
			qc.invalidateQueries({ queryKey: ["dashboard", uid] });
		}
	});
	const goals = goalsQ.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl font-bold",
				children: "Savings goals"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-muted-foreground",
				children: "Set concrete targets and watch the bars fill up."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-primary" }), " New goal"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						addGoal.mutate();
					},
					className: "grid gap-4 md:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Emergency fund",
								maxLength: 100,
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Target amount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0.01",
							step: "0.01",
							value: target,
							onChange: (e) => setTarget(e.target.value),
							placeholder: "5000",
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Starting saved" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0",
							step: "0.01",
							value: saved,
							onChange: (e) => setSaved(e.target.value),
							placeholder: "0"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Target date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: targetDate,
							onChange: (e) => setTargetDate(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: addGoal.isPending,
								className: "gradient-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Create goal"]
							})
						})
					]
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [goals.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft md:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-8 text-center text-sm text-muted-foreground",
						children: "No goals yet. Try “Emergency fund — $5,000” to start."
					})
				}), goals.map((g) => {
					const t = Number(g.target_amount);
					const s = Number(g.saved_amount);
					const pct = Math.min(100, s / t * 100);
					const daysLeft = g.target_date ? differenceInCalendarDays(new Date(g.target_date), /* @__PURE__ */ new Date()) : null;
					const done = s >= t;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: `shadow-soft ${done ? "border-success/50" : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4 sm:p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-lg font-semibold break-words",
											children: g.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "break-words",
												children: [
													formatCurrency(s),
													" of ",
													formatCurrency(t)
												]
											}), done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success",
												children: "Achieved 🎉"
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => remove.mutate(g.id),
										className: "shrink-0 rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: pct,
									className: "mt-4"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center justify-between text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [pct.toFixed(1), "%"] }), g.target_date && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: daysLeft && daysLeft > 0 ? `${daysLeft} days left · ${formatDate(g.target_date)}` : "Due" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap items-center gap-2",
									children: [[
										10,
										25,
										100
									].map((amt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "secondary",
										size: "sm",
										onClick: () => contribute.mutate({
											id: g.id,
											delta: amt,
											current: s
										}),
										children: ["+", formatCurrency(amt)]
									}, amt)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => contribute.mutate({
											id: g.id,
											delta: -10,
											current: s
										}),
										children: ["−", formatCurrency(10)]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManualContribution, {
									goalId: g.id,
									current: s,
									onSubmit: (delta) => contribute.mutate({
										id: g.id,
										delta,
										current: s
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3 text-primary" }), " keep contributing"]
									})
								})
							]
						})
					}, g.id);
				})]
			})
		]
	});
}
function ManualContribution({ goalId, onSubmit }) {
	const [amount, setAmount] = (0, import_react.useState)("");
	function submit(sign) {
		const n = Number(amount);
		if (!amount || Number.isNaN(n) || n <= 0) {
			toast.error("Enter a valid amount");
			return;
		}
		onSubmit(sign * n);
		setAmount("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 flex items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				min: "0",
				step: "0.01",
				placeholder: "Custom amount",
				value: amount,
				onChange: (e) => setAmount(e.target.value),
				className: "h-8 max-w-[140px]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "secondary",
				onClick: () => submit(1),
				children: "Add"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => submit(-1),
				children: "Remove"
			})
		]
	});
}
//#endregion
export { GoalsPage as component };
