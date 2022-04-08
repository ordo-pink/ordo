import { app, BrowserWindow, dialog, ipcMain, Menu, shell } from "electron";
import install, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";
import { centerWindow, enforceMacOSAppLocation, is, setContentSecurityPolicy } from "electron-util";
import { FSWatcher } from "chokidar";

import { store } from "@core/config-store";
import { getTemplateMenu } from "@utils/menu-template";
import { listFolder } from "@modules/file-explorer/file-tree/list-folder";
import { updateFolder } from "@modules/file-explorer/file-tree/update-folder";
import { readFile } from "@modules/file-explorer/file-tree/read-file";
import { createFile } from "@modules/file-explorer/file-tree/create-file";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const windows = new Set<BrowserWindow>();

const watcher = new FSWatcher({ ignored: store.get("explorer.exclude") });

if (!is.development) {
	setContentSecurityPolicy(`
script-src 'self' ordo-app;
img-src * data: file:;
style-src 'unsafe-inline', ordo-app data: file:;
font-src 'self', ordo-app file:;
connect-src 'self', ordo-app;
base-uri 'none';
form-action 'none';
frame-ancestors 'none';
object-src 'none';
`);
} else {
	setContentSecurityPolicy(`img-src * data: file:;`);
}

if (require("electron-squirrel-startup")) {
	app.quit();
}

ipcMain.handle("ordo", (e, data) => {
	if (data.event === "@application/get-setting") {
		return store.get(data.payload);
	}

	if (data.event === "@application/set-setting") {
		return store.set(data.payload.key, data.payload.value);
	}

	if (data.event === "@file-explorer/update-folder") {
		updateFolder(data.payload.path, data.payload);
	}

	if (data.event === "@file-explorer/select-project-folder") {
		const paths = dialog.showOpenDialogSync({
			properties: ["openDirectory", "createDirectory", "promptToCreate"],
		});

		return paths ? paths[0] : null;
	}

	if (data.event === "@file-explorer/list-folder") {
		const recentProjects: string[] = store.get("window.recentProjects");
		store.set("window.recentProjects", Array.from(new Set(recentProjects.concat([data.payload]).slice(0, 5))));

		watcher.add(data.payload);

		["change", "unlink", "addDir", "unlinkDir"].forEach((type) => {
			watcher.on(type, (_, path) => {
				if (!path) return;

				e.sender.send("@file-explorer/file-structure-updated", { path, type });
			});
		});

		return listFolder(data.payload);
	}

	if (data.event === "@file-explorer/read-file") {
		return readFile(data.payload);
	}

	if (data.event === "@file-explorer/create-file") {
		return createFile(data.payload.tree, data.payload.path);
	}
});

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

	if (windows.size > 0) {
		centerWindow({ window });
	}

	window.on("resized", saveWindowPosition(window));
	window.on("move", saveWindowPosition(window));
	window.on("close", () => {
		windows.delete(window);
		window = null as any;
	});

	Menu.setApplicationMenu(Menu.buildFromTemplate(getTemplateMenu(createWindow)));

	window.on("ready-to-show", () => {
		window.show();
	});

	windows.add(window);

	window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.on("ready", async () => {
	enforceMacOSAppLocation();
	await createWindow();
});

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
