import type { Folder } from "./main/apis/fs/types"
import type { ColorTheme } from "./main/apis/appearance/types"
import type { Configuration } from "./main/apis/settings/types"

import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("darkModeAPI", {
	set: (theme: ColorTheme) => ipcRenderer.invoke("dark-mode:set", theme),
})

contextBridge.exposeInMainWorld("fileSystemAPI", {
	listFolder: (path: string) => ipcRenderer.invoke("fs:list-folder", path),
	getFile: (path: string) => ipcRenderer.invoke("fs:get-file", path),
	saveFile: (path: string, data: string) => ipcRenderer.invoke("fs:save-file", path, data),
	move: (oldPath: string, newPath: string) => ipcRenderer.invoke("fs:move", oldPath, newPath),
	createFile: (folder: Folder, name: string) => ipcRenderer.invoke("fs:create-file", folder, name),
	createFolder: (folder: Folder, name: string) =>
		ipcRenderer.invoke("fs:create-folder", folder, name),
	deleteFile: (path: string) => ipcRenderer.invoke("fs:delete-file", path),
	deleteFolder: (path: string) => ipcRenderer.invoke("fs:delete-folder", path),
	selectRootFolder: () => ipcRenderer.invoke("fs:select-root-folder"),
})

contextBridge.exposeInMainWorld("settingsAPI", {
	set: <K extends keyof Configuration>(key: K, value: Configuration[K]) =>
		ipcRenderer.invoke("settings:set", key, value),
	get: <K extends keyof Configuration>(key: K) => ipcRenderer.invoke("settings:get", key),
})

contextBridge.exposeInMainWorld("shellAPI", {
	openExternal: (url: string) => ipcRenderer.invoke("shell:open-external", url),
})
