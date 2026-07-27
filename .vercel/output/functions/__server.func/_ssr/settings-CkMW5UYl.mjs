import { i as __toESM } from "../_runtime.mjs";
import { c as setAppCurrency, t as CURRENCIES } from "./format-CUlL4Oov.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BXjpJ96D.mjs";
import { n as Label, t as Input } from "./label-N2deYTEC.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { u as Settings } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-BZaQbCef.mjs";
import { n as useAuth } from "./auth-context-J0MGvtDS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CkMW5UYl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { user } = useAuth();
	const uid = user.id;
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["profile", uid],
		queryFn: async () => (await supabase.from("profiles").select("*").eq("id", uid).maybeSingle()).data
	});
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [currency, setCurrency] = (0, import_react.useState)("USD");
	const [monthlyIncome, setMonthlyIncome] = (0, import_react.useState)("0");
	(0, import_react.useEffect)(() => {
		if (q.data) {
			setFullName(q.data.full_name ?? "");
			setCurrency(q.data.currency ?? "USD");
			setMonthlyIncome(String(q.data.monthly_income ?? 0));
			setAppCurrency(q.data.currency ?? "USD");
		}
	}, [q.data]);
	const save = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("profiles").update({
				full_name: fullName,
				currency,
				monthly_income: Number(monthlyIncome) || 0
			}).eq("id", uid);
			if (error) throw error;
		},
		onSuccess: () => {
			setAppCurrency(currency);
			toast.success("Settings saved");
			qc.invalidateQueries({ queryKey: ["profile", uid] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "font-display text-2xl sm:text-3xl font-bold flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-7 w-7 text-primary" }), " Settings"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-muted-foreground",
			children: "Personalize your WealthPulse experience."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "shadow-soft max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Profile & Preferences" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					save.mutate();
				},
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: user?.email ?? "",
						disabled: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: fullName,
						onChange: (e) => setFullName(e.target.value),
						maxLength: 100
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Preferred currency" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: currency,
							onChange: (e) => setCurrency(e.target.value),
							className: "mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
							children: CURRENCIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.code,
								children: c.label
							}, c.code))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Used throughout the app for money formatting."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Monthly income (optional benchmark)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: "0",
						step: "0.01",
						value: monthlyIncome,
						onChange: (e) => setMonthlyIncome(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: save.isPending,
						className: "gradient-primary",
						children: "Save changes"
					})
				]
			}) })]
		})]
	});
}
//#endregion
export { SettingsPage as component };
