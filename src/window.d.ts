import type { IFileTreeAPI } from "./file-tree/types";
import type { Configuration } from "./main/apis/settings/types";

import { FS_API_KEY } from "./file-tree/api";

declare global {
	interface Window {
		darkModeAPI: IDarkModeAPI;
		[FS_API_KEY]: IFileTreeAPI;
		settingsAPI: ISettingsAPI;
		shellAPI: IShellAPI;
	}
}

export interface IShellAPI {
	openExternal: (url: string) => Promise<void>;
}

export interface IDarkModeAPI {
	toggle: () => Promise<boolean>;
	system: () => Promise<void>;
}

export interface ISettingsAPI {
	get: <K extends keyof Configuration>(key: K) => Promise<Configuration[K]>;
	set: <K extends keyof Configuration>(key: K, value: Configuration[K]) => Promise<void>;
}
