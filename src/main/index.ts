import type { ColorTheme } from "./apis/appearance/types";

import { join } from "path";
import { app, BrowserWindow, ipcMain, shell } from "electron";

import { debounce } from "../utils/function";
import { Settings } from "./apis/settings";
import { setTheme } from "./apis/appearance";
import { registerFileTreeHandlers, removeFileTreeHandlers } from "../file-tree/main";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const settingsFilePath = join(app.getPath("userData"), "configuration.yaml");

Settings.loadFromFile(settingsFilePath);

if (!Settings.get("application.global-settings-path")) {
	Settings.set("application.global-settings-path", settingsFilePath).persist(settingsFilePath);
}

ipcMain.handle("dark-mode:set", (_, theme): ColorTheme => setTheme(theme));

ipcMain.handle("settings:set", (_, key, value) => {
	Settings.set(key, value).persist(Settings.get("application.global-settings-path"));
});
ipcMain.handle("settings:get", (_, key) => Settings.get(key));

ipcMain.handle("shell:open-external", (_, url) => shell.openExternal(url));

const createWindow = async (): Promise<void> => {
	const mainWindow = new BrowserWindow({
		width: Settings.get("window.main-window.width"),
		height: Settings.get("window.main-window.height"),
		x: Settings.get("window.main-window.x"),
		y: Settings.get("window.main-window.y"),
		webPreferences: {
			sandbox: true,
			contextIsolation: true,
			nodeIntegration: false,
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	});

	mainWindow.on(
		"resize",
		debounce(() => {
			const bounds = mainWindow.getBounds();

			Settings.set("window.main-window.height", bounds.height)
				.set("window.main-window.width", bounds.width)
				.set("window.main-window.x", bounds.x)
				.set("window.main-window.y", bounds.y)
				.persist(Settings.get("application.global-settings-path"));
		}, 300),
	);

	registerFileTreeHandlers(ipcMain, mainWindow);

	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	mainWindow.on("closed", () => {
		removeFileTreeHandlers(ipcMain);
		ipcMain.removeHandler("shell:open-external");
	});
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	app.quit();
}

app
	.on("ready", createWindow)
	.on("window-all-closed", () => process.platform !== "darwin" && app.quit())
	.on("activate", () => BrowserWindow.getAllWindows().length === 0 && createWindow());
