import type { ColorTheme } from "./apis/appearance/types"
import { app, BrowserWindow, ipcMain } from "electron"
import { join } from "path"
import { Settings } from "./apis/settings"
import { getFile } from "./apis/fs/get-file"
import { listFolder } from "./apis/fs/list-folder"
import { saveFile } from "./apis/fs/save-file"
import { hashResponse } from "./apis/hash-response"
import { setTheme } from "./apis/appearance"
import { move } from "./apis/fs/move-file"
import { createFile } from "./apis/fs/create-file"
import { createFolder } from "./apis/fs/create-folder"
import { debounce } from "../utils/function"

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

const settingsFilePath = join(app.getPath("userData"), "configuration.yaml")

Settings.loadFromFile(settingsFilePath)

if (!Settings.get("application.global-settings-path")) {
	Settings.set("application.global-settings-path", settingsFilePath).persist(settingsFilePath)
}

ipcMain.handle("dark-mode:set", (_, theme): ColorTheme => setTheme(theme))

ipcMain.handle("fs:list-folder", (_, path) => listFolder(path).then(hashResponse))
ipcMain.handle("fs:get-file", async (_, path) =>
	getFile(path)
		.then((data) => ({ data }))
		.then(hashResponse),
)
ipcMain.handle("fs:save-file", (_, path, data) => saveFile(path, data))
ipcMain.handle("fs:move", (_, oldPath, newPath) => move(oldPath, newPath))
ipcMain.handle("fs:create-file", (_, path) => createFile(path))
ipcMain.handle("fs:create-folder", (_, path) => createFolder(path))

ipcMain.handle("settings:set", (_, key, value) => {
	Settings.set(key, value).persist(Settings.get("application.global-settings-path"))
})
ipcMain.handle("settings:get", (_, key) => Settings.get(key))

const createWindow = (): void => {
	// TODO: mainWindow.setProgressBar
	// TODO: mainWindow.setRepresentedFileName - shows path to the given file in the title bar
	// TODO: mainWindow.setDocumentEdited - shows the icon as gray if set to true
	// TODO: Getting files served with a custom protocol (ordo-fork://)
	// TODO: app.addRecentDocument
	// TODO: app.dock - for MacOS Dock
	const mainWindow = new BrowserWindow({
		width: Settings.get("window.main-window.width"),
		height: Settings.get("window.main-window.height"),
		x: Settings.get("window.main-window.x"),
		y: Settings.get("window.main-window.y"),
		webPreferences: {
			sandbox: true,
			contextIsolation: true,
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	})

	mainWindow.on(
		"resize",
		debounce(() => {
			const bounds = mainWindow.getBounds()

			Settings.set("window.main-window.height", bounds.height)
				.set("window.main-window.width", bounds.width)
				.set("window.main-window.x", bounds.x)
				.set("window.main-window.y", bounds.y)
				.persist(Settings.get("application.global-settings-path"))
		}, 300),
	)

	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	app.quit()
}

app
	.on("ready", createWindow)
	.on("window-all-closed", () => process.platform !== "darwin" && app.quit())
	.on("activate", () => BrowserWindow.getAllWindows().length === 0 && createWindow())
