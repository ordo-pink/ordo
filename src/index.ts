import { app, BrowserWindow, ipcMain } from "electron"
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer"
import { enablePatches } from "immer"
import { WindowContext, WindowState } from "./common/types"

import activityBarIpcMainHandlers from "./containers/activity-bar/main-handlers"

import activities from "./containers/activity-bar/initial-state"
import commander from "./containers/commander/initial-state"
import sidebar from "./containers/sidebar/initial-state"
import suggestions from "./containers/suggestions/initial-state"
import workspace from "./containers/workspace/initial-state"

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit()
}

enablePatches()

const createWindow = (): void => {
	const window = new BrowserWindow({
		webPreferences: {
			sandbox: true,
			contextIsolation: true,
			nodeIntegration: false,
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	})

	const context: WindowContext = {
		window,
	}

	const state: WindowState = {
		activities,
		commander,
		sidebar,
		suggestions,
		workspace,
		components: {},
	}

	const activityBarHandlers = activityBarIpcMainHandlers(ipcMain)

	activityBarHandlers.register(state, context)

	window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

	window.on("close", () => {
		activityBarHandlers.unregister()
	})
}

app.on("ready", async () => {
	if (process.argv.includes("--debug")) {
		console.log("Debug mode on 🙌")
		await installExtension([REACT_DEVELOPER_TOOLS])
	}

	createWindow()
})

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
