import { App, app, BrowserWindow, BrowserWindowConstructorOptions, dialog, ipcMain, Menu } from "electron";
import { identity, ifElse, pipe, tap } from "ramda";
import { join } from "path";
import { KeyboardShortcuts } from "./keybindings/keyboard-shortcuts";
import { getApplicationMenu } from "./application-menu";
import { registerEditorMainAPIs, unregisterEditorMainAPIs } from "./editor/editor-main-api";
import { KeybindableAction } from "./keybindings/keybindable-action";
import { getSettings } from "./configuration/settings";
import { registerSettingsMainAPIs, unregisterSettingsMainAPIs } from "./configuration/settings-main-api";
import { debounce } from "./common/debounce";
import { setState } from "./common/application-state";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const IS_MAC = process.platform === "darwin";

const settings = getSettings(join(app.getPath("userData"), "settings.yml"));
const registerSettingsAPI = registerSettingsMainAPIs(settings);

const config: BrowserWindowConstructorOptions = {
	show: true,
	x: settings.get("last-window.x"),
	y: settings.get("last-window.y"),
	width: settings.get("last-window.width"),
	height: settings.get("last-window.height"),
	webPreferences: {
		sandbox: true,
		contextIsolation: true,
		nodeIntegration: false,
		preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
	},
};

const setWinPosition = debounce(
	(window: BrowserWindow) =>
		settings
			.set("last-window.height", window.getBounds().height)
			.set("last-window.width", window.getBounds().width)
			.set("last-window.x", window.getBounds().x)
			.set("last-window.y", window.getBounds().y),
	300,
);
const quit = () => process.platform !== "darwin" && app.quit();
const activate = () => BrowserWindow.getAllWindows().length === 0 && createWindow();
const isShortcut: (app: App) => boolean = () => require("electron-squirrel-startup");

const loadURL = tap((window: BrowserWindow) => window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY));
const showWindow = tap((window: BrowserWindow) => window.once("ready-to-show", window.show));
const registerResizeListener = tap((window: BrowserWindow) => window.on("resize", () => setWinPosition(window)));
const registerMoveListener = tap((window: BrowserWindow) => window.on("move", () => setWinPosition(window)));
const registerWindowActions = pipe(
	tap(
		(window: BrowserWindow) =>
			(KeyboardShortcuts[KeybindableAction.OPEN].action = () => {
				const filepaths = dialog.showOpenDialogSync(window, {
					properties: ["openDirectory", "createDirectory", "promptToCreate"],
				});

				setState((state) => {
					state.workingDirectory = filepaths[0];
				});
			}),
	),
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
const unregisterHandlersOnClose = tap((window: BrowserWindow) =>
	window.on(
		"closed",
		pipe(
			tap(() => unregisterEditorMainAPIs(ipcMain)),
			tap(() => unregisterSettingsMainAPIs(ipcMain)),
		),
	),
);

const createWindow = pipe(
	() => new BrowserWindow(config),
	tap(() => registerEditorMainAPIs(ipcMain)),
	tap(() => registerSettingsAPI(ipcMain)),
	registerWindowActions,
	registerResizeListener,
	registerMoveListener,
	loadURL,
	showWindow,
	unregisterHandlersOnClose,
);
const handleDesktopShortcuts = ifElse(isShortcut, quit, identity);

const registerReady = tap((app: App) => app.on("ready", createWindow));
const registerWindowAllClosed = tap((app: App) => app.on("window-all-closed", quit));
const registerActivate = tap((app: App) => app.on("activate", activate));

const launch = pipe(handleDesktopShortcuts, registerWindowAllClosed, registerActivate, registerReady);

launch(app);
