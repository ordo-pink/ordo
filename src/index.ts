import { app, BrowserWindow, ipcMain, dialog, Menu } from "electron"
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer"
import { applyPatches, current, enablePatches, isDraft } from "immer"
import { WindowContext, WindowState } from "./common/types"

import application from "./application/initial-state"
import activities from "./containers/activity-bar/initial-state"
import commander from "./containers/commander/initial-state"
import sidebar from "./containers/sidebar/initial-state"
import workspace from "./containers/workspace/initial-state"

import applicationIpcMainHandlers from "./application/main-handlers"
import activityBarIpcMainHandlers from "./containers/activity-bar/main-handlers"
import commanderIpcMainHandlers from "./containers/commander/main-handlers"
import sidebarIpcMainHandlers from "./containers/sidebar/main-handlers"
import workspaceIpcMainHandlers from "./containers/workspace/main-handlers"

import registerApplicationCommands from "./application/commands"
import registerActivityBarCommands from "./containers/activity-bar/commands"
import registerSidebarCommands from "./containers/sidebar/commands"
import registerCommanderCommands from "./containers/commander/commands"

import { applicationMenuTemlate } from "./application/appearance/menus/application-menu"

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

if (require("electron-squirrel-startup")) {
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
		dialog,
	}

	let state: WindowState = {
		application,
		activities,
		commander,
		sidebar,
		workspace,
		components: {},
	}

	const applicationHandlers = applicationIpcMainHandlers(ipcMain)
	const activityBarHandlers = activityBarIpcMainHandlers(ipcMain)
	const commanderHandlers = commanderIpcMainHandlers(ipcMain)
	const sidebarHandlers = sidebarIpcMainHandlers(ipcMain)
	const workspaceHandlers = workspaceIpcMainHandlers(ipcMain)

	activityBarHandlers.register(state, context)
	applicationHandlers.register(state, context)
	commanderHandlers.register(state, context)
	sidebarHandlers.register(state, context)
	workspaceHandlers.register(state, context)

	ipcMain.on("send-state", () => {
		const currentState = isDraft(state) ? current(state) : state
		context.window.webContents.send("set-state", currentState)
	})

	ipcMain.on("apply-main-state-patches", (patches: any) => {
		state = applyPatches(state, patches)
		window.webContents.send("apply-state-patches", patches)
	})

	registerActivityBarCommands(state)
	registerApplicationCommands(state)
	registerSidebarCommands(state)
	registerCommanderCommands(state)

	window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

	Menu.setApplicationMenu(Menu.buildFromTemplate(applicationMenuTemlate(state)))

	window.on("close", () => {
		activityBarHandlers.unregister()
		applicationHandlers.unregister()
		commanderHandlers.unregister()
		sidebarHandlers.unregister()
		workspaceHandlers.unregister()
	})
}

app.on("ready", async () => {
	if (process.argv.includes("--debug")) {
		console.log("Debug mode on 🙌")
		await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
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
