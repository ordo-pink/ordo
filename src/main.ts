import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain } from "electron";
import { join } from "path";

import { KeyboardShortcuts } from "./keybindings/keyboard-shortcuts";
import { EditorMainAPI } from "./editor/editor-main-api";
import { KeybindableAction } from "./keybindings/keybindable-action";
import { getSettings } from "./configuration/settings";
import { debounce } from "./common/debounce";
import { WindowState } from "./common/types";
import { EditorAction } from "./editor/editor-renderer-api";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const IS_MAC = process.platform === "darwin";

const windows = new Set<BrowserWindow>();

const settings = getSettings(join(app.getPath("userData"), "settings.yml"));

const saveWindowSize = (window: BrowserWindow) =>
	settings
		.set("last-window.height", window.getBounds().height)
		.set("last-window.width", window.getBounds().width)
		.set("last-window.x", window.getBounds().x)
		.set("last-window.y", window.getBounds().y);

const config: BrowserWindowConstructorOptions = {
	show: false,
	webPreferences: {
		sandbox: true,
		contextIsolation: true,
		nodeIntegration: false,
		preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
	},
};

const addHandler = <T extends Record<string, (...args: any[]) => any>, K extends keyof T>(
	state: WindowState,
	api: (state: WindowState) => Record<K, T[K]>,
	key: K,
) =>
	ipcMain.handle(
		`${state.window.id}-${key}`,
		(_, ...args: Parameters<T[K]>): ReturnType<T[K]> => api(state)[key](...args),
	);

const removeHandler = (state: WindowState, key: string) => ipcMain.removeHandler(`${state.window.id}-${key}`);

KeyboardShortcuts[KeybindableAction.NEW_WINDOW].action = () => {
	const newWindow = createWindow();
	windows.add(newWindow);
};

const createWindow = () => {
	if (!windows.size) {
		config.x = settings.get("last-window.x");
		config.y = settings.get("last-window.y");
		config.width = settings.get("last-window.width");
		config.height = settings.get("last-window.height");
	}

	const window = new BrowserWindow(config);

	window.on(
		"resize",
		debounce(() => saveWindowSize(window), 300),
	);

	const windowState: WindowState = {
		window,
		settings,
		editor: {
			tabs: [],
			currentTab: 0,
		},
		explorer: null,
		keyBindings: [],
	};

	window.once("ready-to-show", window.show);
	window.on("close", () => {
		windows.delete(window);

		removeHandler(windowState, EditorAction.ADD_TAB);
		removeHandler(windowState, EditorAction.OPEN_TAB);
		removeHandler(windowState, EditorAction.CLOSE_TAB);
		removeHandler(windowState, EditorAction.ON_KEYDOWN);
	});

	windows.add(window);

	addHandler(windowState, EditorMainAPI, EditorAction.ADD_TAB);
	addHandler(windowState, EditorMainAPI, EditorAction.OPEN_TAB);
	addHandler(windowState, EditorMainAPI, EditorAction.CLOSE_TAB);
	addHandler(windowState, EditorMainAPI, EditorAction.ON_KEYDOWN);

	window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	return window;
};

app.on("ready", createWindow);
app.on("activate", () => BrowserWindow.getAllWindows().length === 0 && createWindow());
app.on("window-all-closed", () => !IS_MAC && app.quit());
