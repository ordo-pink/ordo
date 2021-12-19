import { ipcRenderer } from "electron";
import { OrdoSettings } from "./types";

export const SETTINGS_API = "Settings";

export enum SettingsAction {
	GET = "get",
	SET = "set",
}

export const SettingsAPI = {
	[SettingsAction.GET]: <K extends keyof OrdoSettings>(key: K): Promise<OrdoSettings[K]> =>
		ipcRenderer.invoke(SettingsAction.GET, key),
	[SettingsAction.SET]: <K extends keyof OrdoSettings>(key: K, value: OrdoSettings[K]): Promise<void> =>
		ipcRenderer.invoke(SettingsAction.SET, key, value),
};
