import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("ordo", {
	emit: (key: string, ...args: unknown[]) => {
		ipcRenderer.invoke(key, ...args)
	},
})
