import { App, app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain, Menu } from "electron";
import { identity, ifElse, pipe, tap } from "ramda";
import { KeyboardShortcuts } from "./keybindings/keyboard-shortcuts";
import { getApplicationMenu } from "./application-menu";
import { registerEditorMainAPIs } from "./editor/editor-main-api";
import { KeybindableAction } from "./keybindings/keybindable-action";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const IS_MAC = process.platform === "darwin";

const config: BrowserWindowConstructorOptions = {
	show: true,
	webPreferences: {
		sandbox: true,
		contextIsolation: true,
		nodeIntegration: false,
		preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
	},
};

const quit = () => process.platform !== "darwin" && app.quit();
const activate = () => BrowserWindow.getAllWindows().length === 0 && createWindow();
const isShortcut = (_: App) => require("electron-squirrel-startup");

const loadURL = tap((window: BrowserWindow) => window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY));
const showWindow = tap((window: BrowserWindow) => window.once("ready-to-show", window.show));
const registerWindowActions = pipe(
	tap(
		(window: BrowserWindow) =>
			(KeyboardShortcuts[KeybindableAction.TOGGLE_DEV_TOOLS].action = () => window.webContents.toggleDevTools()),
	),
	tap(
		(window: BrowserWindow) =>
			(KeyboardShortcuts[KeybindableAction.RESTART_WINDOW].action = () => window.webContents.reload()),
	),
	tap(() => pipe(getApplicationMenu(KeyboardShortcuts), Menu.buildFromTemplate, Menu.setApplicationMenu)(IS_MAC)),
);

const createWindow = pipe(
	() => new BrowserWindow(config),
	tap(() => registerEditorMainAPIs(ipcMain)),
	registerWindowActions,
	loadURL,
	showWindow,
);
const handleDesktopShortcuts = ifElse(isShortcut, quit, identity);

const registerReady = tap((app: App) => app.on("ready", createWindow));
const registerWindowAllClosed = tap((app: App) => app.on("window-all-closed", quit));
const registerActivate = tap((app: App) => app.on("activate", activate));

const launch = pipe(handleDesktopShortcuts, registerWindowAllClosed, registerActivate, registerReady);

launch(app);
