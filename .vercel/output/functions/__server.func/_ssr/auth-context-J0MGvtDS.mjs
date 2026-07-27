import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-BZaQbCef.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-context-J0MGvtDS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)({
	session: null,
	user: null,
	loading: true,
	isAdmin: false
});
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
			setSession(s);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!session?.user) {
			setIsAdmin(false);
			return;
		}
		supabase.from("user_roles").select("role").eq("user_id", session.user.id).then(({ data }) => {
			setIsAdmin(!!data?.some((r) => r.role === "admin"));
		});
	}, [session?.user?.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			session,
			user: session?.user ?? null,
			loading,
			isAdmin
		},
		children
	});
}
var useAuth = () => (0, import_react.useContext)(Ctx);
//#endregion
export { useAuth as n, AuthProvider as t };
