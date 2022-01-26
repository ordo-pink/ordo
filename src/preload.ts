import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ordo", {
	emit: (...args: [string, unknown]) => {
		ipcRenderer.send("something-happened", args);
	},
});

ipcRenderer.on("apply-state-patches", (_, detail) =>
	window.dispatchEvent(new CustomEvent("apply-state-patches", { detail })),
);

ipcRenderer.on("set-state", (_, detail) => window.dispatchEvent(new CustomEvent("set-state", { detail })));
