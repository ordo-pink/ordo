import type { IFileTreeAPI, OrdoFile, OrdoFolder } from "./types";
import type { IFileTree } from "./file-tree";

import { IpcMain, BrowserWindow, IpcMainInvokeEvent, dialog, shell } from "electron";
import { identity } from "ramda";
import { join } from "path";
import YAML from "yaml";
import { promises } from "fs";

import { FileTreeAPI } from "./api";
import { listFolder } from "./folder/list-folder";
import { Settings } from "../main/apis/settings";
import { getFileWithBody } from "./file/get-file-content";

let fileTree: IFileTree;

type IpcMainInvokeEventHandler<T extends (...args: any) => any> = (
	e: IpcMainInvokeEvent,
	...args: Parameters<T>
) => ReturnType<T>;

const mainHandle =
	(ipcMain: IpcMain) =>
	<K extends FileTreeAPI>(key: K, handler: IpcMainInvokeEventHandler<IFileTreeAPI[K]>) =>
		ipcMain.handle(key, handler);

const confirmRemoval = (window: BrowserWindow, path: string) => {
	const response = dialog.showMessageBoxSync(window, {
		type: "question",
		buttons: ["Yes", "No"],
		title: "Confirm removal",
		message: `Are you sure you want to remove\n"${path}"?`,
	});

	return response === 0;
};

const mainRemoveHandle = (ipcMain: IpcMain) => (key: FileTreeAPI) => ipcMain.removeHandler(key);

export const registerFileTreeHandlers = async (
	ipcMain: IpcMain,
	window: BrowserWindow,
): Promise<void> => {
	if (!fileTree) {
		fileTree = await listFolder(Settings.get("application.root-folder-path"));
	}

	const handle = mainHandle(ipcMain);

	handle(FileTreeAPI.GET_FILE, async (_, path) => {
		return fileTree
			.getFile("path", path)
			.map(getFileWithBody)
			.fold(() => null, identity);
	});

	handle(FileTreeAPI.DELETE_FILE, async (_, path: string) => {
		const shouldRemove = confirmRemoval(window, path);

		if (shouldRemove) {
			return shell.trashItem(path).then(() => {
				fileTree
					.getFile("path", path)
					.chain((node: OrdoFile) => fileTree.deleteFile(node))
					.fold(
						() => null,
						(tree) => (fileTree = tree),
					);

				return fileTree.getRoot().fold(() => null, identity);
			});
		}

		return fileTree.getRoot().fold(() => null, identity);
	});

	handle(FileTreeAPI.SELECT_ROOT_FOLDER, () =>
		dialog
			.showOpenDialog(window, {
				properties: ["openDirectory", "createDirectory", "promptToCreate"],
			})
			.then(async ({ filePaths }) => {
				Settings.set("application.root-folder-path", filePaths[0])
					.set("application.last-open-file", "")
					.persist(Settings.get("application.global-settings-path"));

				fileTree = await listFolder(filePaths[0]);

				return fileTree.getRoot().fold(() => null, identity);
			}),
	);

	handle(FileTreeAPI.GET_FOLDER, async (_, path) => {
		fileTree = await listFolder(path);

		return fileTree.getRoot().fold(() => null, identity);
	});

	// handle(FileTreeAPI.SAVE_FILE, (_, path, data) => saveFile(path, data));
	// TODO Only add to recent if the file was updated
	// handle(FileTreeAPI.MOVE_FILE, (_, oldPath, newPath) => move(oldPath, newPath));
	// handle(FileTreeAPI.MOVE_FOLDER, (_, oldPath, newPath) => move(oldPath, newPath));
	handle(FileTreeAPI.CREATE_FILE, async (_, path) =>
		fileTree.createPhysicalFile(path).then((e) =>
			e.fold(
				() => null,
				(tree) => {
					fileTree = tree;
					return fileTree.getRoot().fold(() => null, identity);
				},
			),
		),
	);
	handle(FileTreeAPI.CREATE_FOLDER, (_, path) =>
		fileTree.createPhysicalFolder(path).then((e) =>
			e.fold(
				() => null,
				(tree) => {
					fileTree = tree;
					return fileTree.getRoot().fold(() => null, identity);
				},
			),
		),
	);
	handle(FileTreeAPI.UPDATE_FILE, (_, path, increment) => {
		return fileTree
			.updateFile(path, (state: OrdoFile) => {
				Object.keys(increment).forEach((key: keyof OrdoFile) => {
					(state as any)[key] = increment[key];
				});
			})
			.fold(
				() => {
					return null;
				},
				(tree) => {
					fileTree = tree;
					return fileTree.getRoot().fold(() => null, identity);
				},
			);
	});
	handle(FileTreeAPI.UPDATE_FOLDER, (_, path, increment) => {
		const props = Object.keys(increment);

		const dotOrdo: Partial<OrdoFolder> = {};

		if (props.includes("color")) {
			dotOrdo.color = increment.color;
		}

		if (props.includes("collapsed")) {
			dotOrdo.collapsed = increment.collapsed;
		}

		if (Object.keys(dotOrdo).length) {
			const dotOrdoPath = join(path, ".ordo");
			promises
				.readFile(dotOrdoPath, "utf-8")
				.then(YAML.parse)
				.then((data) => promises.writeFile(dotOrdoPath, YAML.stringify({ ...data, ...dotOrdo })))
				.catch(() => promises.writeFile(dotOrdoPath, YAML.stringify(dotOrdo)));
		}

		return fileTree
			.updateFolder(path, (state: OrdoFolder) => {
				Object.keys(increment).forEach((key: keyof OrdoFolder) => {
					(state as any)[key] = increment[key];
				});
			})
			.fold(
				() => {
					return null;
				},
				(tree) => {
					fileTree = tree;
					return fileTree.getRoot().fold(() => null, identity);
				},
			);
	});
	handle(FileTreeAPI.DELETE_FOLDER, async (_, path) => {
		const shouldRemove = confirmRemoval(window, path);

		if (shouldRemove) {
			return shell.trashItem(path).then(() => {
				fileTree
					.getFolder("path", path)
					.chain((node: OrdoFolder) => fileTree.deleteFolder(node))
					.fold(
						() => null,
						(tree) => (fileTree = tree),
					);

				return fileTree.getRoot().fold(() => null, identity);
			});
		}

		return fileTree.getRoot().fold(() => null, identity);
	});
};

export const removeFileTreeHandlers = (ipcMain: IpcMain): void => {
	const removeHandler = mainRemoveHandle(ipcMain);

	removeHandler(FileTreeAPI.SELECT_ROOT_FOLDER);
	removeHandler(FileTreeAPI.CREATE_FOLDER);
	removeHandler(FileTreeAPI.GET_FOLDER);
	removeHandler(FileTreeAPI.UPDATE_FOLDER);
	removeHandler(FileTreeAPI.MOVE_FOLDER);
	removeHandler(FileTreeAPI.DELETE_FOLDER);
	removeHandler(FileTreeAPI.CREATE_FILE);
	removeHandler(FileTreeAPI.GET_FILE);
	removeHandler(FileTreeAPI.UPDATE_FILE);
	removeHandler(FileTreeAPI.MOVE_FILE);
	removeHandler(FileTreeAPI.DELETE_FILE);
	removeHandler(FileTreeAPI.SAVE_FILE);
};
