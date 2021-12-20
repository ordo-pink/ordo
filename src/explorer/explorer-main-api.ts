import { BrowserWindow, IpcMain } from "electron";
import { pipe, tap } from "ramda";
import { getSettings } from "../configuration/settings";
import { ExplorerAction } from "./explorer-renderer-api";
import { listFolder } from "./folder/list-folder";
import { openFolder } from "./folder/open-folder";
import { updateFolder } from "./folder/update-folder";
import { OrdoFolder } from "./types";

let tree: OrdoFolder;

export const registerExplorerMainAPIs = (window: BrowserWindow) =>
	pipe(
		tap((ipcMain: IpcMain) => ipcMain.handle(ExplorerAction.OPEN_FOLDER, () => openFolder(window))),
		tap((ipcMain: IpcMain) =>
			ipcMain.handle(ExplorerAction.GET_FOLDER, async () => {
				const oldPath = getSettings().get("last-window.folder");

				if (oldPath) {
					tree = await listFolder(oldPath);
				} else {
					tree = await listFolder(openFolder(window));
				}

				return tree;
			}),
		),
		tap((ipcMain: IpcMain) =>
			ipcMain.handle(ExplorerAction.UPDATE_FOLDER, (_, path: string, update: Partial<OrdoFolder>) => {
				tree = updateFolder(tree, path, update);
				return tree;
			}),
		),
	);

export const unregisterExplorerMainAPIs = pipe(
	tap((ipcMain: IpcMain) => ipcMain.removeHandler(ExplorerAction.OPEN_FOLDER)),
	tap((ipcMain: IpcMain) => ipcMain.removeHandler(ExplorerAction.GET_FOLDER)),
	tap((ipcMain: IpcMain) => ipcMain.removeHandler(ExplorerAction.UPDATE_FOLDER)),
);
