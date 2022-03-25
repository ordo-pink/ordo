import { app, BrowserWindow, Menu } from "electron";
import install, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";
import { is, setContentSecurityPolicy } from "electron-util";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

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

const createWindow = async (): Promise<void> => {
	if (process.argv.includes("--debug") && is.development) {
		await install([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);
	}

	const mainWindow = new BrowserWindow({
		show: false,
		height: 600,
		width: 800,
		icon: "../assets/android-chrome-512x512.png",
		titleBarStyle: "hiddenInset",
		webPreferences: {
			sandbox: true,
			contextIsolation: true,
			nodeIntegration: false,
			allowRunningInsecureContent: false,
			accessibleTitle: "Order",
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	});

	mainWindow.on("resize", () => {
		const [width, height] = mainWindow.getSize();

		// internalSettings.emit("@internal-settings/update", {
		// 	"window.last-window-height": height,
		// 	"window.last-window-width": width,
		// });
	});

	mainWindow.on("moved", () => {
		const [x, y] = mainWindow.getPosition();

		// internalSettings.emit("@internal-settings/update", {
		// 	"window.last-window-x": x,
		// 	"window.last-window-y": y,
		// });
	});

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
