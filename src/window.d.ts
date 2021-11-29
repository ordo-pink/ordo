import { OrdoFile, OrdoFolder, MDFile, WithBody } from "./global-context/types"
import type { Configuration } from "./main/apis/settings/types"

declare global {
	interface Window {
		darkModeAPI: IDarkModeAPI
		fileSystemAPI: IFileSystemAPI
		settingsAPI: ISettingsAPI
		shellAPI: IShellAPI
	}
}

export interface IFileSystemAPI {
	listFolder: (path: string) => Promise<OrdoFolder>
	getFile: (path: string) => Promise<WithBody<MDFile>>
	saveFile: (path: string, data: string) => Promise<void>
	move: (oldPath: string, newPath: string) => Promise<void>
	createFile: (folder: OrdoFolder, name: string) => Promise<OrdoFile>
	createFolder: (folder: OrdoFolder, name: string) => Promise<OrdoFolder>
	delete: (path: string) => Promise<boolean>
	findFileBySubPath: (subPath: string) => Promise<WithBody<MDFile>>
	selectRootFolder: () => Promise<string>
}

export interface IShellAPI {
	openExternal: (url: string) => Promise<void>
}

export interface IDarkModeAPI {
	toggle: () => Promise<boolean>
	system: () => Promise<void>
}

export interface ISettingsAPI {
	get: <K extends keyof Configuration>(key: K) => Promise<Configuration[K]>
	set: <K extends keyof Configuration>(key: K, value: Configuration[K]) => Promise<void>
}
