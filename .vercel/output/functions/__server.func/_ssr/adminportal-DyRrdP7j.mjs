import { i as __toESM } from "../_runtime.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as formatCurrency, o as formatDate } from "./format-CUlL4Oov.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BXjpJ96D.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as Label, t as Input } from "./label-N2deYTEC.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CWb7Nc4C.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as LoaderCircle, l as ShieldCheck, o as Trash2, r as UserPlus, t as X, x as Crown } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/adminportal-DyRrdP7j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var adminPortalLogin = createServerFn({ method: "POST" }).inputValidator((v) => v).handler(createSsrRpc("45f98fc6427d0fd07012a0c7a909d514ce489d4ad3f9eee63addcb7719889381"));
var adminListOverview = createServerFn({ method: "POST" }).inputValidator((v) => v).handler(createSsrRpc("b08c3ee60ccf05b62cdc33fcb94ff383789ac3e5fb85d09658d15346329aaa1b"));
var adminCreateUser = createServerFn({ method: "POST" }).inputValidator((v) => v).handler(createSsrRpc("f0a068262f95c00f1ddd08dd60d3b6e48be920977bb06ca0e3e281581562366f"));
var adminDeleteUser = createServerFn({ method: "POST" }).inputValidator((v) => v).handler(createSsrRpc("b6bfec6134d949abd1e27267e212d5fe55449a468f877dbb517cf281243f0221"));
var adminSetRole = createServerFn({ method: "POST" }).inputValidator((v) => v).handler(createSsrRpc("c1aaccb6e6390a1199fd9958df680f2e23cbbc301895e9679d328044c683d0f2"));
createServerFn({ method: "POST" }).inputValidator((v) => v).handler(createSsrRpc("c2bdcb190eeb30b6910c8d1dc9ea231bb43e72dd85cc3ddf13a48146762c2847"));
var adminUpdateRecord = createServerFn({ method: "POST" }).inputValidator((v) => v).handler(createSsrRpc("d876919398b58efb28697246396f881fa635c692dea5f0a41411e5dd1f402619"));
var adminDeleteRecord = createServerFn({ method: "POST" }).inputValidator((v) => v).handler(createSsrRpc("49029b21660a5d0da78db3f0199a9a036091fa139ebf1a9d2e2b359dcadd3c8a"));
var STORAGE_KEY = "admin-portal-token";
function AdminPortalPage() {
	const [token, setToken] = (0, import_react.useState)(() => typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null);
	if (!token) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordGate, { onSuccess: (t) => {
		sessionStorage.setItem(STORAGE_KEY, t);
		setToken(t);
	} });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, {
		token,
		onUnauthorized: () => {
			sessionStorage.removeItem(STORAGE_KEY);
			setToken(null);
		}
	});
}
function PasswordGate({ onSuccess }) {
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		try {
			onSuccess((await adminPortalLogin({ data: { password } })).token);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Login failed");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-muted/30 p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-sm shadow-elegant",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "items-center text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-12 w-12 place-items-center rounded-xl bg-foreground text-background",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-6 w-6" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "mt-2",
					children: "Admin Portal"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "admin-password",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "admin-password",
						type: "password",
						autoFocus: true,
						required: true,
						value: password,
						onChange: (e) => setPassword(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					disabled: loading,
					className: "w-full",
					children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Enter"]
				})]
			}) })]
		})
	});
}
function AdminDashboard({ token, onUnauthorized }) {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["admin-portal-overview"],
		queryFn: () => adminListOverview({ data: { token } }),
		retry: false
	});
	(0, import_react.useEffect)(() => {
		if (q.error) {
			toast.error(q.error instanceof Error ? q.error.message : "Session expired");
			onUnauthorized();
		}
	}, [q.error]);
	const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-portal-overview"] });
	const setRole = useMutation({
		mutationFn: (v) => adminSetRole({ data: {
			token,
			...v
		} }),
		onSuccess: () => {
			toast.success("Role updated");
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const deleteUser = useMutation({
		mutationFn: (userId) => adminDeleteUser({ data: {
			token,
			userId
		} }),
		onSuccess: () => {
			toast.success("User deleted");
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const createUser = useMutation({
		mutationFn: (v) => adminCreateUser({ data: {
			token,
			...v
		} }),
		onSuccess: () => {
			toast.success("User created");
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const deleteRecord = useMutation({
		mutationFn: (v) => adminDeleteRecord({ data: {
			token,
			...v
		} }),
		onSuccess: () => {
			toast.success("Deleted");
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const updateRecord = useMutation({
		mutationFn: (v) => adminUpdateRecord({ data: {
			token,
			...v
		} }),
		onSuccess: () => {
			toast.success("Saved");
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const [viewUserId, setViewUserId] = (0, import_react.useState)(null);
	const adminUserIds = (0, import_react.useMemo)(() => new Set((q.data?.roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id)), [q.data]);
	const profileById = (0, import_react.useMemo)(() => new Map((q.data?.profiles ?? []).map((p) => [p.id, p])), [q.data]);
	if (q.isLoading || !q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	const totalIncome = q.data.incomes.reduce((s, r) => s + Number(r.amount), 0);
	const totalExpense = q.data.expenses.reduce((s, r) => s + Number(r.amount), 0);
	const totalInvested = q.data.investments.reduce((s, r) => s + Number(r.current_value), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl space-y-6 p-4 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 place-items-center rounded-lg bg-foreground text-background",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold",
						children: "Admin Portal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Full platform access — every user, every record."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddUserDialog, {
					onCreate: (v) => createUser.mutate(v),
					pending: createUser.isPending
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Total users",
						value: String(q.data.users.length)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Admins",
						value: String(adminUserIds.size)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Total income",
						value: formatCurrency(totalIncome)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Total expenses",
						value: formatCurrency(totalExpense)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "-mt-3 text-xs text-muted-foreground",
				children: "Totals are a raw sum across all users and don't account for differing currencies — see each user's own currency in the tables below."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "users",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "users",
							children: "Users"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "money",
							children: "Money records"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "feedback",
							children: "Feedback"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "users",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "mt-4 shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: [
								"Users (",
								q.data.users.length,
								")"
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "overflow-x-auto p-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Email" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Name" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Joined" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Role" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right",
										children: "Actions"
									})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: q.data.users.map((u) => {
									const isAdmin = adminUserIds.has(u.id);
									const profile = profileById.get(u.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
											className: "font-medium",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setViewUserId(u.id),
												className: "text-left text-primary hover:underline",
												children: u.email
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: profile?.full_name ?? "—" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(u.created_at) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-3 w-3" }), " Admin"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "User"
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
											className: "text-right space-x-2 whitespace-nowrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => setRole.mutate({
													userId: u.id,
													makeAdmin: !isAdmin
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "mr-1 h-3.5 w-3.5" }), isAdmin ? "Remove admin" : "Make admin"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "destructive",
												onClick: () => {
													if (confirm(`Delete ${u.email}? This removes all their data permanently.`)) deleteUser.mutate(u.id);
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
											})]
										})
									] }, u.id);
								}) })] })
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "money",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyTable, {
									title: "Incomes",
									rows: q.data.incomes,
									columns: [
										"email",
										"source",
										"amount",
										"received_on",
										"note"
									],
									table: "incomes",
									onDelete: (id) => deleteRecord.mutate({
										table: "incomes",
										id
									}),
									onSave: (id, patch) => updateRecord.mutate({
										table: "incomes",
										id,
										patch
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyTable, {
									title: "Expenses",
									rows: q.data.expenses,
									columns: [
										"email",
										"category",
										"amount",
										"spent_on",
										"note"
									],
									table: "expenses",
									onDelete: (id) => deleteRecord.mutate({
										table: "expenses",
										id
									}),
									onSave: (id, patch) => updateRecord.mutate({
										table: "expenses",
										id,
										patch
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyTable, {
									title: "Investments",
									rows: q.data.investments,
									columns: [
										"email",
										"name",
										"invested_amount",
										"current_value"
									],
									table: "investments",
									onDelete: (id) => deleteRecord.mutate({
										table: "investments",
										id
									}),
									onSave: (id, patch) => updateRecord.mutate({
										table: "investments",
										id,
										patch
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyTable, {
									title: "Savings goals",
									rows: q.data.goals,
									columns: [
										"email",
										"name",
										"target_amount",
										"saved_amount"
									],
									table: "savings_goals",
									onDelete: (id) => deleteRecord.mutate({
										table: "savings_goals",
										id
									}),
									onSave: (id, patch) => updateRecord.mutate({
										table: "savings_goals",
										id,
										patch
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: ["Total investments value across all users: ", formatCurrency(totalInvested)]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "feedback",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "mt-4 shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: [
								"Feedback (",
								q.data.feedback.length,
								")"
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "overflow-x-auto p-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Email" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Message" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "text-right",
										children: "Actions"
									})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: q.data.feedback.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: f.email }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "max-w-md truncate",
										children: f.message
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: f.status }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(f.created_at) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: "text-right space-x-2",
										children: [f.status !== "resolved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => updateRecord.mutate({
												table: "feedback",
												id: f.id,
												patch: { status: "resolved" }
											}),
											children: "Resolve"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "destructive",
											onClick: () => deleteRecord.mutate({
												table: "feedback",
												id: f.id
											}),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})]
									})
								] }, f.id)) })] })
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!viewUserId,
				onOpenChange: (open) => !open && setViewUserId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-h-[85vh] max-w-3xl overflow-y-auto",
					children: viewUserId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserDetailView, {
						userId: viewUserId,
						data: q.data
					})
				})
			})
		]
	});
}
function UserDetailView({ userId, data }) {
	const user = data.users.find((u) => u.id === userId);
	const profile = data.profiles.find((p) => p.id === userId);
	const currency = profile?.currency ?? "USD";
	const incomes = data.incomes.filter((r) => r.user_id === userId);
	const expenses = data.expenses.filter((r) => r.user_id === userId);
	const investments = data.investments.filter((r) => r.user_id === userId);
	const goals = data.goals.filter((r) => r.user_id === userId);
	const habitCount = data.habits.filter((h) => h.user_id === userId).length;
	const logCount = data.logs.filter((l) => l.user_id === userId).length;
	const totalIncome = incomes.reduce((s, r) => s + Number(r.amount), 0);
	const totalExpense = expenses.reduce((s, r) => s + Number(r.amount), 0);
	const totalInvested = investments.reduce((s, r) => s + Number(r.current_value), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: profile?.full_name || user?.email }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "-mt-4 text-sm text-muted-foreground",
				children: [user?.email, " · Read-only view"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Income",
						value: formatCurrency(totalIncome, currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Expenses",
						value: formatCurrency(totalExpense, currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Invested (current)",
						value: formatCurrency(totalInvested, currency)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mb-2 text-sm font-semibold",
				children: [
					"Incomes (",
					incomes.length,
					")"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnlyList, {
				rows: incomes,
				render: (r) => `${r.source} — ${formatCurrency(Number(r.amount), currency)} · ${formatDate(r.received_on)}`
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mb-2 text-sm font-semibold",
				children: [
					"Expenses (",
					expenses.length,
					")"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnlyList, {
				rows: expenses,
				render: (r) => `${r.category} — ${formatCurrency(Number(r.amount), currency)} · ${formatDate(r.spent_on)}`
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mb-2 text-sm font-semibold",
				children: [
					"Investments (",
					investments.length,
					")"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnlyList, {
				rows: investments,
				render: (r) => `${r.name} — ${formatCurrency(Number(r.current_value), currency)} (invested ${formatCurrency(Number(r.invested_amount), currency)})`
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mb-2 text-sm font-semibold",
				children: [
					"Savings goals (",
					goals.length,
					")"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadOnlyList, {
				rows: goals,
				render: (r) => `${r.name} — ${formatCurrency(Number(r.saved_amount), currency)} of ${formatCurrency(Number(r.target_amount), currency)}`
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Habits: ",
					habitCount,
					" · Habit logs: ",
					logCount
				]
			})
		]
	});
}
function ReadOnlyList({ rows, render }) {
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "None yet"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-1 text-sm",
		children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "rounded-md bg-muted/50 px-3 py-1.5",
			children: render(r)
		}, r.id))
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-soft",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xl font-bold",
				children: value
			})]
		})
	});
}
function AddUserDialog({ onCreate, pending }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [makeAdmin, setMakeAdmin] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-2 h-4 w-4" }), " Add user"] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add user" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				onCreate({
					email,
					password,
					fullName,
					makeAdmin
				});
				setOpen(false);
				setEmail("");
				setPassword("");
				setFullName("");
				setMakeAdmin(false);
			},
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						required: true,
						minLength: 6,
						value: password,
						onChange: (e) => setPassword(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: fullName,
						onChange: (e) => setFullName(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: makeAdmin,
						onChange: (e) => setMakeAdmin(e.target.checked)
					}), "Grant admin role"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					disabled: pending,
					className: "w-full",
					children: [pending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Create user"]
				})
			]
		})] })]
	});
}
function MoneyTable({ title, rows, columns, table, onDelete, onSave }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: [
			title,
			" (",
			rows.length,
			")"
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "overflow-x-auto p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "capitalize",
				children: c.replace(/_/g, " ")
			}, c)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Actions"
			})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditableRow, {
				row,
				columns,
				onDelete,
				onSave
			}, row.id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: columns.length + 1,
				className: "text-center text-sm text-muted-foreground",
				children: "No records"
			}) })] })] })
		})]
	});
}
function EditableRow({ row, columns, onDelete, onSave }) {
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [values, setValues] = (0, import_react.useState)(Object.fromEntries(columns.filter((c) => c !== "email").map((c) => [c, String(row[c] ?? "")])));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [columns.map((c) => {
		if (c === "email") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: row.email }, c);
		if (!editing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: c.includes("amount") || c.includes("value") ? formatCurrency(Number(row[c]), row.currency ?? "USD") : String(row[c] ?? "—") }, c);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "h-8 w-32",
			value: values[c],
			onChange: (e) => setValues((v) => ({
				...v,
				[c]: e.target.value
			}))
		}) }, c);
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
		className: "text-right space-x-2 whitespace-nowrap",
		children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			onClick: () => {
				const patch = {};
				for (const c of columns) {
					if (c === "email") continue;
					patch[c] = c.includes("amount") || c.includes("value") ? Number(values[c]) : values[c];
				}
				onSave(row.id, patch);
				setEditing(false);
			},
			children: "Save"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			variant: "outline",
			onClick: () => setEditing(false),
			children: "Cancel"
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			variant: "outline",
			onClick: () => setEditing(true),
			children: "Edit"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			variant: "destructive",
			onClick: () => onDelete(row.id),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
		})] })
	})] });
}
//#endregion
export { AdminPortalPage as component };
