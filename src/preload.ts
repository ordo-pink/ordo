import { contextBridge, ipcRenderer } from "electron"
import { OrdoEvents } from "./common/types"

contextBridge.exposeInMainWorld("ordo", {
	emit: (...args: OrdoEvents) => {
		ipcRenderer.send(args[0], ...args.slice(1))
	},
})

ipcRenderer.on("apply-state-patches", (_, detail) =>
	window.dispatchEvent(new CustomEvent("apply-state-patches", { detail })),
)

ipcRenderer.on("set-state", (_, detail) => window.dispatchEvent(new CustomEvent("set-state", { detail })))
