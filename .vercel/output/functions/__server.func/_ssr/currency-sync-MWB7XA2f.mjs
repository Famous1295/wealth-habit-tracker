import { i as __toESM } from "../_runtime.mjs";
import { c as setAppCurrency, l as subscribeCurrency, s as getAppCurrency } from "./format-CUlL4Oov.mjs";
import { s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-BZaQbCef.mjs";
import { n as useAuth } from "./auth-context-J0MGvtDS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/currency-sync-MWB7XA2f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useCurrency() {
	return (0, import_react.useSyncExternalStore)(subscribeCurrency, getAppCurrency, getAppCurrency);
}
function CurrencySync() {
	const { user } = useAuth();
	(0, import_react.useEffect)(() => {
		if (!user) return;
		supabase.from("profiles").select("currency").eq("id", user.id).maybeSingle().then(({ data }) => {
			if (data?.currency) setAppCurrency(data.currency);
		});
	}, [user?.id]);
	return null;
}
//#endregion
export { useCurrency as n, CurrencySync as t };
