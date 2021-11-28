import { ArbitraryFile, ArbitraryFolder, MDFile, WithBody } from "./global-context/types"
import type { Hashed } from "./main/apis/hash-response"
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
	listFolder: (path: string) => Promise<Hashed<ArbitraryFolder>>
	getFile: (path: string) => Promise<Hashed<WithBody<MDFile>>>
	saveFile: (path: string, data: string) => Promise<void>
	move: (oldPath: string, newPath: string) => Promise<void>
	createFile: (folder: ArbitraryFolder, name: string) => Promise<ArbitraryFile>
	createFolder: (folder: ArbitraryFolder, name: string) => Promise<ArbitraryFolder>
	delete: (path: string) => Promise<void>
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
