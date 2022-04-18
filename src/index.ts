<<<<<<< HEAD
import { app, BrowserWindow, ipcMain, dialog, Menu, globalShortcut, shell, clipboard } from "electron";
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";
import { enablePatches } from "immer";

import { WindowContext } from "@core/types";
import registerApplicationEventHandlers from "@modules/application/main-handlers";
import registerActivityBarEventHandlers from "@containers/activity-bar/main-handlers";
import registerCommanderEventHandlers from "@containers/commander/main-handlers";
import registerSidebarEventHandlers from "@containers/sidebar/main-handlers";
import registerWorkspaceEventHandlers from "@containers/workspace/main-handlers";
import registerEditorEventHandlers from "@modules/editor/main-handlers";
import registerApplicationCommands from "@modules/application/commands";
import registerActivityBarCommands from "@containers/activity-bar/commands";
import registerSidebarCommands from "@containers/sidebar/commands";
import registerCommanderCommands from "@containers/commander/commands";
import registerEditorCommands from "@modules/editor/commands";
import { applicationMenuTemlate } from "@core/appearance/menus/application-menu";
import { EventTransmission } from "./event-transmission";
=======
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
>>>>>>> ordo-app/main

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

<<<<<<< HEAD
=======
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

>>>>>>> ordo-app/main
if (require("electron-squirrel-startup")) {
	app.quit();
}

<<<<<<< HEAD
enablePatches();

const createWindow = (): void => {
	const window = new BrowserWindow({
		show: false,
=======
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
>>>>>>> ordo-app/main
		webPreferences: {
			sandbox: true,
			contextIsolation: true,
			nodeIntegration: false,
<<<<<<< HEAD
=======
			allowRunningInsecureContent: false,
			accessibleTitle: "Order",
>>>>>>> ordo-app/main
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	});

<<<<<<< HEAD
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

	const transmission = new EventTransmission(context);

	app.on("open-file", (_, path) => {
		transmission.emit("@application/open-folder", path);
	});

	ipcMain.on("something-happened", (_, args) => {
		transmission.emit(args[0], args[1]);
	});

	ipcMain.on("send-state", () => {
		context.window.webContents.send(
			"set-state",
			transmission.get((s) => s),
		);
	});

	registerApplicationEventHandlers(transmission);
	registerActivityBarEventHandlers(transmission);
	registerCommanderEventHandlers(transmission);
	registerSidebarEventHandlers(transmission);
	registerWorkspaceEventHandlers(transmission);
	registerEditorEventHandlers(transmission);

	registerActivityBarCommands(transmission);
	registerApplicationCommands(transmission);
	registerSidebarCommands(transmission);
	registerCommanderCommands(transmission);
	registerEditorCommands(transmission);
=======
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
>>>>>>> ordo-app/main

	window.on("ready-to-show", () => {
		window.show();
	});

<<<<<<< HEAD
	window.on("focus", () => {
		transmission
			.get((s) => s.application.commands)
			.forEach((command) => {
				if (command.shortcut) {
					globalShortcut.register(command.shortcut, () => transmission.emit(command.event as keyof OrdoEvent));
				}
			});
	});

	window.on("blur", () => {
		globalShortcut.unregisterAll();
	});

	Menu.setApplicationMenu(Menu.buildFromTemplate(applicationMenuTemlate(transmission)));

	window.on("close", () => {
		ipcMain.removeAllListeners("something-happened");
		ipcMain.removeAllListeners("send-state");
	});
=======
	windows.add(window);
>>>>>>> ordo-app/main

	window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

app.on("ready", async () => {
<<<<<<< HEAD
	if (process.argv.includes("--debug")) {
		console.log("Debug mode on 🙌");
		await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);
	}

	createWindow();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
=======
	enforceMacOSAppLocation();
	await createWindow();
});

app.on("window-all-closed", () => {
	if (!is.macos) {
>>>>>>> ordo-app/main
		app.quit();
	}
});

<<<<<<< HEAD
app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
=======
app.on("activate", async () => {
	if (windows.size === 0) {
		await createWindow();
>>>>>>> ordo-app/main
	}
});
