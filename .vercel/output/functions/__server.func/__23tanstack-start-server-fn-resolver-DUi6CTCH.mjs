//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-DUi6CTCH.js
var manifest = {
	"45f98fc6427d0fd07012a0c7a909d514ce489d4ad3f9eee63addcb7719889381": {
		functionName: "adminPortalLogin_createServerFn_handler",
		importer: () => import("./_ssr/admin-portal.functions-DvY385p6.mjs")
	},
	"49029b21660a5d0da78db3f0199a9a036091fa139ebf1a9d2e2b359dcadd3c8a": {
		functionName: "adminDeleteRecord_createServerFn_handler",
		importer: () => import("./_ssr/admin-portal.functions-DvY385p6.mjs")
	},
	"ad0f1c2f01aa2ac44bd00882e4cae283132eeec37762c981363819a13c8c3fda": {
		functionName: "getFinancialInsights_createServerFn_handler",
		importer: () => import("./_ssr/insights.functions-Dbf9hveG.mjs")
	},
	"b08c3ee60ccf05b62cdc33fcb94ff383789ac3e5fb85d09658d15346329aaa1b": {
		functionName: "adminListOverview_createServerFn_handler",
		importer: () => import("./_ssr/admin-portal.functions-DvY385p6.mjs")
	},
	"b6bfec6134d949abd1e27267e212d5fe55449a468f877dbb517cf281243f0221": {
		functionName: "adminDeleteUser_createServerFn_handler",
		importer: () => import("./_ssr/admin-portal.functions-DvY385p6.mjs")
	},
	"c1aaccb6e6390a1199fd9958df680f2e23cbbc301895e9679d328044c683d0f2": {
		functionName: "adminSetRole_createServerFn_handler",
		importer: () => import("./_ssr/admin-portal.functions-DvY385p6.mjs")
	},
	"c2bdcb190eeb30b6910c8d1dc9ea231bb43e72dd85cc3ddf13a48146762c2847": {
		functionName: "adminUpdateProfile_createServerFn_handler",
		importer: () => import("./_ssr/admin-portal.functions-DvY385p6.mjs")
	},
	"d876919398b58efb28697246396f881fa635c692dea5f0a41411e5dd1f402619": {
		functionName: "adminUpdateRecord_createServerFn_handler",
		importer: () => import("./_ssr/admin-portal.functions-DvY385p6.mjs")
	},
	"f0a068262f95c00f1ddd08dd60d3b6e48be920977bb06ca0e3e281581562366f": {
		functionName: "adminCreateUser_createServerFn_handler",
		importer: () => import("./_ssr/admin-portal.functions-DvY385p6.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
