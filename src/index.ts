import { app, BrowserWindow, Menu } from "electron";
import install, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";
import { is, setContentSecurityPolicy } from "electron-util";
import Store from "electron-store";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

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
];

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

	const mainWindow = new BrowserWindow({
		show: false,
		height: store.get("window.height"),
		width: store.get("window.width"),
		x: store.get("window.position.x"),
		y: store.get("window.position.y"),
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

	mainWindow.on("resized", saveWindowPosition(mainWindow));
	mainWindow.on("move", saveWindowPosition(mainWindow));

	Menu.setApplicationMenu(Menu.buildFromTemplate(MENU as any));

	mainWindow.on("ready-to-show", () => {
		mainWindow.show();
	});

	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (is.macos) {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
