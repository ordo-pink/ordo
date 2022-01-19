import { contextBridge, ipcRenderer } from "electron"
import { OrdoEvents } from "./common/types"

contextBridge.exposeInMainWorld("ordo", {
	emit: (...args: OrdoEvents) => {
		ipcRenderer.invoke(args[0], ...args.slice(1))
	},
})

ipcRenderer.on("apply-state-patches", (_, detail) =>
	window.dispatchEvent(new CustomEvent("apply-state-patches", { detail })),
)
