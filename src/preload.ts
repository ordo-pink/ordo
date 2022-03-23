import { contextBridge, ipcRenderer } from "electron";

// contextBridge.exposeInMainWorld("ordo", {
// 	emit: <Params, Result>(request: JsonRpcRequest<Params>): void => {
// 		ipcRenderer.send("@ordo/json-rpc", request);
// 	},
// });

ipcRenderer.on("@ordo/update-state", (_, detail) => {
	window.dispatchEvent(new CustomEvent("@ordo/update-state", { detail }));
});

ipcRenderer.on("@ordo/set-state", (_, detail) => {
	window.dispatchEvent(new CustomEvent("@ordo/set-state", { detail }));
});
