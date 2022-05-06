import { BrowserWindow, dialog, app, clipboard, shell, ipcMain, globalShortcut } from "electron";
import install, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";
import { is, centerWindow } from "electron-util";

import { internalSettingsStore } from "@core/settings/internal-settings";
import { Transmission } from "@core/transmission";
import { saveWindowPosition } from "@core/window/save-window-position";
import { initEvents } from "@init/events";
import { initCommands } from "@init/commands";
import { initialState } from "@init/state";
import { WindowContext } from "@init/types";
import { debounce } from "@utils/debounce";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const debounceSaveWindowPosition = debounce((window: BrowserWindow) => saveWindowPosition(window), 1000);

const windows = new Set<BrowserWindow>();

export const createWindow = async (): Promise<void> => {
	if (process.argv.includes("--debug") && is.development) {
		await install([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);
	}

	let window: BrowserWindow = new BrowserWindow({
		show: false,
		height:
			windows.size > 0
				? (internalSettingsStore.get("window.position.height") as number) - 100
				: internalSettingsStore.get("window.height"),
		width:
			windows.size > 0
				? (internalSettingsStore.get("window.width") as number) - 100
				: internalSettingsStore.get("window.width"),
		x:
			windows.size > 0
				? (internalSettingsStore.get("window.position.x") as number) + 100
				: internalSettingsStore.get("window.position.x"),
		y:
			windows.size > 0
				? (internalSettingsStore.get("window.position.y") as number) + 100
				: internalSettingsStore.get("window.position.y"),
		icon: "assets/favicon.ico",
		// titleBarStyle: "hiddenInset",
		acceptFirstMouse: true,
		webPreferences: {
			sandbox: true,
			contextIsolation: true,
			nodeIntegration: false,
			allowRunningInsecureContent: false,
			accessibleTitle: "Order",
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	});

	if (windows.size > 0) {
		centerWindow({ window });
	}

	window.on("resize", () => debounceSaveWindowPosition(window));
	window.on("move", () => debounceSaveWindowPosition(window));
	window.on("close", () => {
		windows.delete(window);
		window = null as any;
	});

	// Menu.setApplicationMenu(Menu.buildFromTemplate(getTemplateMenu(createWindow)));

	window.on("ready-to-show", () => {
		window.show();
	});

	windows.add(window);

	const context: WindowContext = {
		window,
		dialog,
		addRecentDocument: (path) => {
			app.addRecentDocument(path);
		},
		toClipboard: (content) => {
			clipboard.writeText(content);
		},
		fromClipboard: clipboard.readText,
		showInFolder: shell.showItemInFolder,
		trashItem: shell.trashItem,
	};

	const transmission = new Transmission(initialState, context);

	initEvents(transmission);

	ipcMain.on("ordo", (_, { event, payload }) => transmission.emit(event, payload));

	await initCommands(transmission);

	window.on("focus", () => {
		transmission
			.select((s) => s.app.commands)
			.forEach((command) => {
				if (command.accelerator) {
					globalShortcut.register(command.accelerator, () => transmission.emit(command.event, null));
				}
			});
	});

	window.on("blur", () => {
		transmission.emit("@editor/unfocus", null);
		globalShortcut.unregisterAll();
	});

	window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};
