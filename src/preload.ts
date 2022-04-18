import { contextBridge, ipcMain, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ordo", {
	emit: (event: string, payload: any) => ipcRenderer.invoke("ordo", { event, payload }),
});

ipcRenderer.on("@file-explorer/file-structure-updated", (_, detail: string) => {
	window.dispatchEvent(new CustomEvent("@file-explorer/file-structure-updated", { detail }));
});
