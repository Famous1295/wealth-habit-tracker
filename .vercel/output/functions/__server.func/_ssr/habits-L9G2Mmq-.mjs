import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BXjpJ96D.mjs";
import { n as Label, t as Input } from "./label-N2deYTEC.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { T as Check, m as Plus, o as Trash2, y as Flame } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-BZaQbCef.mjs";
import { n as useAuth } from "./auth-context-J0MGvtDS.mjs";
import { n as subDays, r as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/habits-L9G2Mmq-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HabitsPage() {
	const { user } = useAuth();
	const uid = user.id;
	const qc = useQueryClient();
	const habitsQ = useQuery({
		queryKey: ["habits", uid],
		queryFn: async () => (await supabase.from("habits").select("*").eq("user_id", uid).order("created_at", { ascending: false })).data ?? []
	});
	const logsQ = useQuery({
		queryKey: ["habit_logs", uid],
		queryFn: async () => (await supabase.from("habit_logs").select("*").eq("user_id", uid)).data ?? []
	});
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [frequency, setFrequency] = (0, import_react.useState)("daily");
	const addHabit = useMutation({
		mutationFn: async () => {
			const trimmed = name.trim();
			if (!trimmed) throw new Error("Habit name is required");
			if (trimmed.length > 100) throw new Error("Name too long");
			const { error } = await supabase.from("habits").insert({
				user_id: uid,
				name: trimmed,
				description: description.trim() || null,
				frequency
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Habit added");
			setName("");
			setDescription("");
			qc.invalidateQueries({ queryKey: ["habits", uid] });
		},
		onError: (e) => toast.error(e.message)
	});
	const toggleLog = useMutation({
		mutationFn: async ({ habit_id, day, existingId }) => {
			if (existingId) {
				const { error } = await supabase.from("habit_logs").delete().eq("id", existingId);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("habit_logs").insert({
					user_id: uid,
					habit_id,
					logged_on: day
				});
				if (error) throw error;
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["habit_logs", uid] });
			qc.invalidateQueries({ queryKey: ["dashboard", uid] });
		},
		onError: (e) => toast.error(e.message)
	});
	const removeHabit = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("habits").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Habit removed");
			qc.invalidateQueries({ queryKey: ["habits", uid] });
			qc.invalidateQueries({ queryKey: ["habit_logs", uid] });
		}
	});
	const habits = habitsQ.data ?? [];
	const logs = logsQ.data ?? [];
	const today = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
	const last14 = Array.from({ length: 14 }).map((_, i) => format(subDays(/* @__PURE__ */ new Date(), 13 - i), "yyyy-MM-dd"));
	function streakOf(habit_id) {
		const days = new Set(logs.filter((l) => l.habit_id === habit_id).map((l) => l.logged_on));
		let streak = 0;
		for (let i = 0; i < 365; i++) {
			const d = format(subDays(/* @__PURE__ */ new Date(), i), "yyyy-MM-dd");
			if (days.has(d)) streak++;
			else break;
		}
		return streak;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl font-bold",
				children: "Financial habits"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-muted-foreground",
				children: "Save daily. Track weekly. Invest monthly. Small acts compound."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "New habit" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						addHabit.mutate();
					},
					className: "grid gap-4 md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Save $10 today",
								maxLength: 100,
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Frequency" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: frequency,
							onChange: (e) => setFrequency(e.target.value),
							className: "mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
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
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: addHabit.isPending,
								className: "w-full gradient-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), " Add"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: description,
								onChange: (e) => setDescription(e.target.value),
								placeholder: "Why does this habit matter?",
								maxLength: 200
							})]
						})
					]
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [habits.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-8 text-center text-sm text-muted-foreground",
						children: [
							"Start with something small: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "“Track today’s expenses”" }),
							" or ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "“Save $5”" }),
							"."
						]
					})
				}), habits.map((h) => {
					const habitLogs = logs.filter((l) => l.habit_id === h.id);
					const streak = streakOf(h.id);
					const todayLog = habitLogs.find((l) => l.logged_on === today);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4 sm:p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-base sm:text-lg font-semibold break-words",
												children: h.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground",
												children: h.frequency
											})]
										}), h.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-muted-foreground break-words",
											children: h.description
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4" }),
													" ",
													streak
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: todayLog ? "secondary" : "default",
												className: todayLog ? "" : "gradient-primary",
												onClick: () => toggleLog.mutate({
													habit_id: h.id,
													day: today,
													existingId: todayLog?.id
												}),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1 h-4 w-4" }),
													" ",
													todayLog ? "Done" : "Mark done"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => removeHabit.mutate(h.id),
												className: "rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 grid grid-cols-14 gap-1",
									style: { gridTemplateColumns: "repeat(14, minmax(0, 1fr))" },
									children: last14.map((d) => {
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											title: d,
											className: `aspect-square rounded ${habitLogs.some((l) => l.logged_on === d) ? "bg-primary" : "bg-muted"}`
										}, d);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Last 14 days"
								})
							]
						})
					}, h.id);
				})]
			})
		]
	});
}
//#endregion
export { HabitsPage as component };
