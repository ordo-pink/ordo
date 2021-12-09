import type { ColorTheme } from "./main/apis/appearance/types";
import type { Configuration } from "./main/apis/settings/types";

import { contextBridge, ipcRenderer } from "electron";
import { registerFileTreeAPIs } from "./file-tree/preload";

contextBridge.exposeInMainWorld("darkModeAPI", {
	set: (theme: ColorTheme) => ipcRenderer.invoke("dark-mode:set", theme),
});

registerFileTreeAPIs(contextBridge, ipcRenderer);

contextBridge.exposeInMainWorld("settingsAPI", {
	set: <K extends keyof Configuration>(key: K, value: Configuration[K]) =>
		ipcRenderer.invoke("settings:set", key, value),
	get: <K extends keyof Configuration>(key: K) => ipcRenderer.invoke("settings:get", key),
});

contextBridge.exposeInMainWorld("shellAPI", {
	openExternal: (url: string) => ipcRenderer.invoke("shell:open-external", url),
});
