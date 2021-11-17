import type { Hashed } from "./main/apis/hash-response"
import type { FileMetadata, Folder, IFile } from "./main/apis/fs/types"
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
	listFolder: (path: string) => Promise<Hashed<Folder>>
	getFile: (path: string) => Promise<Hashed<{ data: string }>>
	saveFile: (path: string, data: string) => Promise<void>
	move: (oldPath: string, newPath: string) => Promise<void>
	createFile: (folder: Folder, name: string) => Promise<FileMetadata>
	createFolder: (folder: Folder, name: string) => Promise<Folder>
	deleteFile: (path: string) => Promise<void>
	deleteFolder: (path: string) => Promise<void>
	findFileBySubPath: (subPath: string) => Promise<IFile>
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
