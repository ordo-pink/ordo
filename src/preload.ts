import { contextBridge, ipcRenderer } from "electron";
<<<<<<< HEAD
import { SettingsAPI, SETTINGS_API } from "./configuration/settings-renderer-api";
import { EditorAPI, EDITOR_API } from "./editor/editor-renderer-api";
import { ExplorerAPI, EXPLORER_API } from "./explorer/explorer-renderer-api";

contextBridge.exposeInMainWorld(EDITOR_API, EditorAPI);
contextBridge.exposeInMainWorld(SETTINGS_API, SettingsAPI);
contextBridge.exposeInMainWorld(EXPLORER_API, ExplorerAPI);

ipcRenderer.on("SetState", (e, detail) => window.dispatchEvent(new CustomEvent("SetState", { detail })));
=======

contextBridge.exposeInMainWorld("ordo", {
	emit: (...args: [string, unknown]) => {
		ipcRenderer.send("something-happened", args);
	},
});

ipcRenderer.on("apply-state-patches", (_, detail) =>
	window.dispatchEvent(new CustomEvent("apply-state-patches", { detail })),
);

ipcRenderer.on("set-state", (_, detail) => window.dispatchEvent(new CustomEvent("set-state", { detail })));
>>>>>>> ordo/main
