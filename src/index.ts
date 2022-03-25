import { app, BrowserWindow, Menu } from "electron";
import install, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";
import { is, setContentSecurityPolicy } from "electron-util";
import Store from "electron-store";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const windows = new Set<BrowserWindow>();

const store = new Store({
	schema: {
		window: {
			type: "object",
			properties: {
				width: {
					type: "number",
					default: 800,
				},
				height: {
					type: "number",
					default: 600,
				},
				position: {
					type: "object",
					properties: {
						x: {
							type: ["number", "null"],
							default: null,
						},
						y: {
							type: ["number", "null"],
							default: null,
						},
					},
				},
			},
		},
	},
});

if (!is.development) {
	setContentSecurityPolicy(`
script-src 'self' ordo-app;
img-src ordo-app data: file:;
style-src 'unsafe-inline', ordo-app data: file:;
font-src 'self', ordo-app file:;
connect-src 'self', ordo-app;
base-uri 'none';
form-action 'none';
frame-ancestors 'none';
object-src 'none';
`);
}

if (require("electron-squirrel-startup")) {
	app.quit();
}

const saveWindowPosition = (window: BrowserWindow) => () => {
	const [x, y] = window.getPosition();
	const [width, height] = window.getSize();

	store.set("window.width", width);
	store.set("window.height", height);
	store.set("window.position.x", x);
	store.set("window.position.y", y);
};

const createWindow = async (): Promise<void> => {
	if (process.argv.includes("--debug") && is.development) {
		await install([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);
	}

	let window: BrowserWindow = new BrowserWindow({
		show: false,
		height: windows.size > 0 ? (store.get("window.position.height") as number) - 100 : store.get("window.height"),
		width: windows.size > 0 ? (store.get("window.width") as number) - 100 : store.get("window.width"),
		x: windows.size > 0 ? (store.get("window.position.x") as number) + 100 : store.get("window.position.x"),
		y: windows.size > 0 ? (store.get("window.position.y") as number) + 100 : store.get("window.position.y"),
		icon: "../assets/android-chrome-512x512.png",
		titleBarStyle: "hiddenInset",
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

	window.on("resized", saveWindowPosition(window));
	window.on("move", saveWindowPosition(window));
	window.on("close", () => {
		windows.delete(window);
		window = null as any;
	});

	const MENU = [
		{
			label: "ORDO",
			submenu: [
				{ role: "about" },
				{ type: "separator" },
				{ role: "services" },
				{ type: "separator" },
				{ role: "hide" },
				{ role: "hideOthers" },
				{ role: "unhide" },
				{ type: "separator" },
				{ role: "quit" },
			],
		},
		{
			label: "&File",
			submenu: [
				{
					label: "New Window",
					accelerator: "CommandOrControl+Shift+N",
					click: async () => {
						await createWindow();
					},
				},
				{ type: "separator" },

				{
					label: "Close Window",
					accelerator: "CommandOrControl+Shift+W",
					click: () => {
						BrowserWindow.getFocusedWindow()?.close();
					},
				},
			],
		},
	];

	Menu.setApplicationMenu(Menu.buildFromTemplate(MENU as any));

	window.on("ready-to-show", () => {
		window.show();
	});

	windows.add(window);

	window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on("activate", async () => {
	if (windows.size === 0) {
		await createWindow();
	}
});
