import { contextBridge, ipcMain, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ordo", {
	emit: (event: string, payload: any) => ipcRenderer.invoke("ordo", { event, payload }),
});
