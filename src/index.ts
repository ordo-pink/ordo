import { app, BrowserWindow, ipcMain, dialog, Menu, globalShortcut } from "electron";
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";
import { enablePatches } from "immer";
import { WindowContext } from "./common/types";

import registerApplicationEventHandlers from "./application/main-handlers";
import registerActivityBarEventHandlers from "./containers/activity-bar/main-handlers";
import registerCommanderEventHandlers from "./containers/commander/main-handlers";
import registerSidebarEventHandlers from "./containers/sidebar/main-handlers";
import registerWorkspaceEventHandlers from "./containers/workspace/main-handlers";

import registerApplicationCommands from "./application/commands";
import registerActivityBarCommands from "./containers/activity-bar/commands";
import registerSidebarCommands from "./containers/sidebar/commands";
import registerCommanderCommands from "./containers/commander/commands";

import { applicationMenuTemlate } from "./application/appearance/menus/application-menu";
import { EventTransmission } from "./event-transmission";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
	app.quit();
}

enablePatches();

const createWindow = (): void => {
	const window = new BrowserWindow({
		webPreferences: {
			sandbox: true,
			contextIsolation: true,
			nodeIntegration: false,
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	});

	const context: WindowContext = {
		window,
		dialog,
	};

	const transmission = new EventTransmission(context);

	ipcMain.on("something-happened", (_, args) => {
		transmission.emit(args[0], args[1]);
	});

	ipcMain.on("send-state", () => {
		context.window.webContents.send(
			"set-state",
			transmission.get((s) => s),
		);
	});

	registerApplicationEventHandlers(transmission);
	registerActivityBarEventHandlers(transmission);
	registerCommanderEventHandlers(transmission);
	registerSidebarEventHandlers(transmission);
	registerWorkspaceEventHandlers(transmission);

	registerActivityBarCommands(transmission);
	registerApplicationCommands(transmission);
	registerSidebarCommands(transmission);
	registerCommanderCommands(transmission);

	window.on("focus", () => {
		transmission
			.get((s) => s.application.commands)
			.forEach((command) => {
				if (command.shortcut) {
					globalShortcut.register(command.shortcut, () => transmission.emit(command.event));
				}
			});
	});

	window.on("blur", () => {
		globalShortcut.unregisterAll();
	});

	Menu.setApplicationMenu(Menu.buildFromTemplate(applicationMenuTemlate(transmission)));

	window.on("close", () => {
		ipcMain.removeAllListeners("something-happened");
		ipcMain.removeAllListeners("send-state");
	});

	window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.on("ready", async () => {
	if (process.argv.includes("--debug")) {
		console.log("Debug mode on 🙌");
		await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);
	}

	createWindow();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
