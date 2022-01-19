import { app, BrowserWindow, ipcMain } from "electron"
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer"
import { enablePatches } from "immer"
import { WindowContext, WindowState } from "./common/types"

import application from "./application/initial-state"
import activities from "./containers/activity-bar/initial-state"
import commander from "./containers/commander/initial-state"
import sidebar from "./containers/sidebar/initial-state"
import suggestions from "./containers/suggestions/initial-state"
import workspace from "./containers/workspace/initial-state"

import applicationIpcMainHandlers from "./application/main-handlers"
import activityBarIpcMainHandlers from "./containers/activity-bar/main-handlers"
import commanderIpcMainHandlers from "./containers/commander/main-handlers"
import sidebarIpcMainHandlers from "./containers/sidebar/main-handlers"

import registerApplicationCommands from "./application/commands"
import registerActivityBarCommands from "./containers/activity-bar/commands"
import registerSidbarCommands from "./containers/sidebar/commands"

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

	let state: WindowState = {
		application,
		activities,
		commander,
		sidebar,
		suggestions,
		workspace,
		components: {},
	}

	state = registerActivityBarCommands(state)
	state = registerApplicationCommands(state)
	state = registerSidbarCommands(state)

	const applicationHandlers = applicationIpcMainHandlers(ipcMain)
	const activityBarHandlers = activityBarIpcMainHandlers(ipcMain)
	const commanderHandlers = commanderIpcMainHandlers(ipcMain)
	const sidebarHandlers = sidebarIpcMainHandlers(ipcMain)

	activityBarHandlers.register(state, context)
	applicationHandlers.register(state, context)
	commanderHandlers.register(state, context)
	sidebarHandlers.register(state, context)

	window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

	window.on("close", () => {
		activityBarHandlers.unregister()
		applicationHandlers.unregister()
		commanderHandlers.unregister()
		sidebarHandlers.unregister()
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
