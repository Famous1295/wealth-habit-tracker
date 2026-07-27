import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-B9amimQo.js
var $$splitComponentImporter = () => import("./auth-Dvk4Yr54.mjs");
var Route = createFileRoute("/auth")({
	ssr: false,
	validateSearch: (s) => ({ mode: s.mode === "signup" ? "signup" : s.mode === "signin" ? "signin" : void 0 }),
	head: () => ({ meta: [{ title: "Sign in — WealthPulse" }, {
		name: "description",
		content: "Access your WealthPulse account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
