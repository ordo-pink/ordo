import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, Menu } from "electron";
import { join } from "path";

import { EditorMainAPI } from "./editor/editor-main-api";
import { KeybindableAction } from "./keybindings/keybindable-action";
import { getSettings } from "./configuration/settings";
import { debounce } from "./common/debounce";
import { WindowState } from "./common/types";
import { EditorAction } from "./editor/editor-renderer-api";
import { ExplorerMainAPI } from "./explorer/explorer-main-api";
import { ExplorerAction } from "./explorer/explorer-renderer-api";
import { getApplicationMenu } from "./application-menu";
import { KeyboardShortcut } from "./keybindings/types";
import { activeWindow } from "electron-util";

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
) => ipcMain.handle(key as string, (_, ...args: Parameters<T[K]>): ReturnType<T[K]> => api(state)[key](...args));

const removeHandler = (key: string) => ipcMain.removeHandler(key);

const createWindow = () => {
	config.x = settings.get("last-window.x");
	config.y = settings.get("last-window.y");
	config.width = settings.get("last-window.width");
	config.height = settings.get("last-window.height");

	let window = new BrowserWindow(config);

	window.on(
		"resize",
		debounce(() => saveWindowSize(window), 300),
	);

	const state: WindowState = {
		window,
		settings,
		editor: {
			tabs: [],
			currentTab: 0,
		},
		explorer: {
			tree: null,
			selection: null,
		},
		keybindings: {} as Record<KeybindableAction, KeyboardShortcut>,
		constants: {
			isMac: IS_MAC,
		},
	};

	const keybindings: Record<KeybindableAction, KeyboardShortcut> = {
		[KeybindableAction.OPEN_FOLDER]: {
			label: "Open Folder",
			accelerator: "CommandOrControl+O",
			action: async (state) => {
				await ExplorerMainAPI(state)[ExplorerAction.OPEN_FOLDER]();
				window.setTitle(`${state.explorer.tree.readableName}`);
			},
		},
		// [KeybindableAction.CLOSE_WINDOW]: {
		// 	label: "Close Window",
		// 	accelerator: "CommandOrControl+Shift+W",
		// 	action: async () => {
		// 		activeWindow().close();
		// 	},
		// },
		[KeybindableAction.CLOSE_TAB]: {
			label: "Close Tab",
			accelerator: "CommandOrControl+W",
			action: async (state) => {
				EditorMainAPI(state)[EditorAction.CLOSE_TAB](state.editor.currentTab);
				state.window.webContents.send("SetState", { explorer: state.explorer, editor: state.editor });
			},
		},
		[KeybindableAction.COPY]: {
			label: "Copy",
			accelerator: "CommandOrControl+C",
			action: () => null,
		},
		[KeybindableAction.CUT]: {
			label: "Cut",
			accelerator: "CommandOrControl+X",
			action: () => null,
		},
		[KeybindableAction.EXPLORER]: {
			label: "Explorer",
			accelerator: "CommandOrControl+Shift+E",
			action: () => null,
		},
		[KeybindableAction.FIND]: {
			label: "Find",
			accelerator: "CommandOrControl+F",
			action: () => null,
		},
		[KeybindableAction.FIND_IN_FILES]: {
			label: "Find in Files",
			accelerator: "CommandOrControl+Shift+F",
			action: () => null,
		},
		[KeybindableAction.GRAPH]: {
			label: "Graph",
			accelerator: "CommandOrControl+Shift+G",
			action: () => null,
		},
		[KeybindableAction.NEW_FILE]: {
			label: "New File",
			accelerator: "CommandOrControl+N",
			action: () => null,
		},
		// [KeybindableAction.NEW_WINDOW]: {
		// 	label: "New Window",
		// 	accelerator: "CommandOrControl+Shift+N",
		// 	action: () => createWindow(),
		// },
		[KeybindableAction.PASTE]: {
			label: "Paste",
			accelerator: "CommandOrControl+V",
			action: () => null,
		},
		[KeybindableAction.REDO]: {
			label: "Redo",
			accelerator: "CommandOrControl+Shift+Z",
			action: () => null,
		},
		[KeybindableAction.RESTART_WINDOW]: {
			label: "Restart Window",
			accelerator: "CommandOrControl+Shift+R",
			action: () => {
				activeWindow().reload();
			},
		},
		[KeybindableAction.SAVE_AS]: {
			label: "Save As",
			accelerator: "CommandOrControl+Shift+S",
			action: () => null,
		},
		[KeybindableAction.SAVE_FILE]: {
			label: "Save File",
			accelerator: "CommandOrControl+S",
			action: (state) => {
				window.setDocumentEdited(false);
				ExplorerMainAPI(state)[ExplorerAction.SAVE_FILE]();
			},
		},
		[KeybindableAction.SELECT_ALL]: {
			label: "Select All",
			accelerator: "CommandOrControl+A",
			action: (state) => {
				if (state.editor.currentTab == null || !state.editor.tabs || !state.editor.tabs.length) {
					return;
				}

				const currentTab = state.editor.tabs[state.editor.currentTab];

				currentTab.selection.start.index = 0;
				currentTab.selection.start.line = 0;
				currentTab.selection.end.index = currentTab.body[currentTab.body.length - 1].length;
				currentTab.selection.end.line = currentTab.body.length - 1;
				currentTab.selection.direction = "ltr";

				state.window.webContents.send("SetState", { explorer: state.explorer, editor: state.editor });
			},
		},
		[KeybindableAction.SETTINGS]: {
			label: "Settings",
			accelerator: "CommandOrControl+,",
			action: () => null,
		},
		[KeybindableAction.TOGGLE_DEV_TOOLS]: {
			label: "Toggle Dev Tools",
			accelerator: "CommandOrControl+Shift+I",
			action: () => activeWindow().webContents.toggleDevTools(),
		},
		[KeybindableAction.UNDO]: {
			label: "Undo",
			accelerator: "CommandOrControl+Z",
			action: () => null,
		},
	};

	state.keybindings = keybindings;

	window.once("ready-to-show", () => {
		Menu.setApplicationMenu(Menu.buildFromTemplate(getApplicationMenu(state)));

		const path = state.settings.get("last-window.folder");

		if (path) {
			ExplorerMainAPI(state)[ExplorerAction.OPEN_FOLDER](path);
		}

		window.show();
	});

	window.on("close", () => {
		removeHandler(EditorAction.ADD_TAB);
		removeHandler(EditorAction.OPEN_TAB);
		removeHandler(EditorAction.CLOSE_TAB);
		removeHandler(EditorAction.ON_KEYDOWN);

		removeHandler(ExplorerAction.CREATE_FILE);
		removeHandler(ExplorerAction.GET_FILE);
		removeHandler(ExplorerAction.UPDATE_FILE);
		removeHandler(ExplorerAction.MOVE_FILE);
		removeHandler(ExplorerAction.DELETE_FILE);
		removeHandler(ExplorerAction.CREATE_FOLDER);
		removeHandler(ExplorerAction.GET_FOLDER);
		removeHandler(ExplorerAction.UPDATE_FOLDER);
		removeHandler(ExplorerAction.MOVE_FOLDER);
		removeHandler(ExplorerAction.DELETE_FOLDER);
		removeHandler(ExplorerAction.OPEN_FOLDER);
		removeHandler(ExplorerAction.SELECT);

		windows.delete(window);
		window = null;
	});

	windows.add(window);

	addHandler(state, EditorMainAPI, EditorAction.ADD_TAB);
	addHandler(state, EditorMainAPI, EditorAction.OPEN_TAB);
	addHandler(state, EditorMainAPI, EditorAction.CLOSE_TAB);
	addHandler(state, EditorMainAPI, EditorAction.ON_KEYDOWN);

	addHandler(state, ExplorerMainAPI, ExplorerAction.CREATE_FILE);
	addHandler(state, ExplorerMainAPI, ExplorerAction.GET_FILE);
	addHandler(state, ExplorerMainAPI, ExplorerAction.UPDATE_FILE);
	addHandler(state, ExplorerMainAPI, ExplorerAction.MOVE_FILE);
	addHandler(state, ExplorerMainAPI, ExplorerAction.DELETE_FILE);
	addHandler(state, ExplorerMainAPI, ExplorerAction.CREATE_FOLDER);
	addHandler(state, ExplorerMainAPI, ExplorerAction.GET_FOLDER);
	addHandler(state, ExplorerMainAPI, ExplorerAction.UPDATE_FOLDER);
	addHandler(state, ExplorerMainAPI, ExplorerAction.MOVE_FOLDER);
	addHandler(state, ExplorerMainAPI, ExplorerAction.DELETE_FOLDER);
	addHandler(state, ExplorerMainAPI, ExplorerAction.OPEN_FOLDER);
	addHandler(state, ExplorerMainAPI, ExplorerAction.SELECT);

	window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.on("ready", () => createWindow());
app.on("activate", () => BrowserWindow.getAllWindows().length === 0 && createWindow());
app.on("window-all-closed", () => !IS_MAC && app.quit());
