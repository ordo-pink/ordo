import { BrowserWindow, IpcMain } from "electron";
import { pipe, tap } from "ramda";
import { KeybindableAction } from "../keybindings/keybindable-action";
import { KeyboardShortcuts } from "../keybindings/keyboard-shortcuts";
import { getSettings } from "../configuration/settings";
import { ExplorerAction } from "./explorer-renderer-api";
import { createFile } from "./folder/create-file";
import { createFolder } from "./folder/create-folder";
import { getFolderOrParent } from "./folder/get-folder-or-parent";
import { listFolder } from "./folder/list-folder";
import { openFolder } from "./folder/open-folder";
import { updateFolder } from "./folder/update-folder";
import { OrdoFolder } from "./types";

let tree: OrdoFolder;

export const registerExplorerMainAPIs = (window: BrowserWindow): ((ipcMain: IpcMain) => IpcMain) =>
	pipe(
		tap(() => {
			KeyboardShortcuts[KeybindableAction.OPEN].action = async () => {
				tree = await listFolder(openFolder(window));
				window.reload();
			};
		}),
		tap((ipcMain: IpcMain) =>
			ipcMain.handle(ExplorerAction.OPEN_FOLDER, async () => {
				tree = await listFolder(openFolder(window));

				return tree;
			}),
		),
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
				if (!tree) {
					return null;
				}

				tree = updateFolder(tree, path, update);
				return tree;
			}),
		),
		tap((ipcMain: IpcMain) =>
			ipcMain.handle(ExplorerAction.GET_FOLDER_OR_PARENT, (_, path: string) => {
				if (!tree) {
					return null;
				}

				return getFolderOrParent(tree, path);
			}),
		),
		tap((ipcMain: IpcMain) =>
			ipcMain.handle(ExplorerAction.CREATE_FILE, async (_, parentPath: string, path: string) => {
				if (!tree) {
					return null;
				}

				tree = await createFile(tree, parentPath, path);
				return tree;
			}),
		),
		tap((ipcMain: IpcMain) =>
			ipcMain.handle(ExplorerAction.CREATE_FOLDER, async (_, parentPath: string, path: string) => {
				if (!tree) {
					return null;
				}

				tree = await createFolder(tree, parentPath, path);
				return tree;
			}),
		),
	);

export const unregisterExplorerMainAPIs = pipe(
	tap((ipcMain: IpcMain) => ipcMain.removeHandler(ExplorerAction.OPEN_FOLDER)),
	tap((ipcMain: IpcMain) => ipcMain.removeHandler(ExplorerAction.GET_FOLDER)),
	tap((ipcMain: IpcMain) => ipcMain.removeHandler(ExplorerAction.UPDATE_FOLDER)),
);
