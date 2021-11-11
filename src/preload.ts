import { contextBridge, ipcRenderer } from "electron"
import { ColorTheme } from "./main/apis/appearance/types"
import { Configuration } from "./main/apis/settings/types"

contextBridge.exposeInMainWorld("darkModeAPI", {
	set: (theme: ColorTheme) => ipcRenderer.invoke("dark-mode:set", theme),
})

contextBridge.exposeInMainWorld("fileSystemAPI", {
	listFolder: (path: string) => ipcRenderer.invoke("fs:list-folder", path),
	getFile: (path: string) => ipcRenderer.invoke("fs:get-file", path),
	saveFile: (path: string, data: string) => ipcRenderer.invoke("fs:save-file", path, data),
	move: (oldPath: string, newPath: string) => ipcRenderer.invoke("fs:move", oldPath, newPath),
	createFile: (path: string) => ipcRenderer.invoke("fs:create-file", path),
	createFolder: (path: string) => ipcRenderer.invoke("fs:create-folder", path),
	deleteFile: (path: string) => ipcRenderer.invoke("fs:delete-file", path),
	deleteFolder: (path: string) => ipcRenderer.invoke("fs:delete-folder", path),
	selectRootFolder: () => ipcRenderer.invoke("fs:select-root-folder"),
})

contextBridge.exposeInMainWorld("settingsAPI", {
	set: <K extends keyof Configuration>(key: K, value: Configuration[K]) =>
		ipcRenderer.invoke("settings:set", key, value),
	get: <K extends keyof Configuration>(key: K) => ipcRenderer.invoke("settings:get", key),
})
