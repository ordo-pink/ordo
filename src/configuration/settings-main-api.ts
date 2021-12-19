import { IpcMain } from "electron";
import { pipe, tap } from "ramda";
import { SettingsAction } from "./settings-renderer-api";
import { SettingsAPI } from "./types";

export const registerSettingsMainAPIs = (settings: SettingsAPI): ((ipcMain: IpcMain) => void) =>
	pipe(
		tap((ipcMain: IpcMain) => ipcMain.handle(SettingsAction.GET, (_, key) => settings.get(key))),
		tap((ipcMain: IpcMain) => ipcMain.handle(SettingsAction.SET, (_, key, value) => settings.set(key, value))),
	);

export const unregisterSettingsMainAPIs = pipe(
	tap((ipcMain: IpcMain) => ipcMain.removeHandler(SettingsAction.GET)),
	tap((ipcMain: IpcMain) => ipcMain.removeHandler(SettingsAction.SET)),
);
