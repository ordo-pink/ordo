import { Hashed } from "./main/apis/hash-response"
import { Folder } from "./main/apis/fs/types"
import { Configuration } from "./main/apis/settings/types"

declare global {
	interface Window {
		darkModeAPI: IDarkModeAPI
		fileSystemAPI: IFileSystemAPI
		settingsAPI: ISettingsAPI
	}
}

export interface IFileSystemAPI {
	listFolder: (path: string) => Promise<Hashed<Folder>>
	getFile: (path: string) => Promise<Hashed<{ data: string }>>
	saveFile: (path: string, data: string) => Promise<void>
	move: (oldPath: string, newPath: string) => Promise<void>
	createFile: (path: string) => Promise<void>
	createFolder: (path: string) => Promise<string>
	deleteFile: (path: string) => Promise<void>
	deleteFolder: (path: string) => Promise<void>
}

export interface IDarkModeAPI {
	toggle: () => Promise<boolean>
	system: () => Promise<void>
}

export interface ISettingsAPI {
	get: <K extends keyof Configuration>(key: K) => Promise<Configuration[K]>
	set: <K extends keyof Configuration>(key: K, value: Configuration[K]) => Promise<void>
}
