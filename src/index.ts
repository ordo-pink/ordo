import { app, BrowserWindow } from "electron";
import { Color } from "@core/apprearance/colors";
import install, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
	app.quit();
}

const createWindow = async (): Promise<void> => {
	if (process.argv.includes("--debug")) {
		await install([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);
	}

	const mainWindow = new BrowserWindow({
		show: false,
		height: 600,
		width: 800,
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

	mainWindow.on("ready-to-show", () => {
		mainWindow.show();
		// mainWindow.webContents.openDevTools();
	});

	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.on("ready", createWindow);

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
