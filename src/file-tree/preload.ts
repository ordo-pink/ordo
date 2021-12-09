import type { ContextBridge, IpcRenderer } from "electron";
import type { IFileTreeAPI } from "./types";

import { FileTreeAPI, FS_API_KEY } from "./api";

const rendererInvoke =
	(ipcRenderer: IpcRenderer) =>
	(key: FileTreeAPI) =>
	(...args: any[]) =>
		ipcRenderer.invoke(String(key), ...args);

export const registerFileTreeAPIs = (
	contextBridge: ContextBridge,
	ipcRenderer: IpcRenderer,
): void => {
	const invoke = rendererInvoke(ipcRenderer);

	contextBridge.exposeInMainWorld(FS_API_KEY, {
		[FileTreeAPI.SELECT_ROOT_FOLDER]: invoke(FileTreeAPI.SELECT_ROOT_FOLDER),
		[FileTreeAPI.CREATE_FOLDER]: invoke(FileTreeAPI.CREATE_FOLDER),
		[FileTreeAPI.GET_FOLDER]: invoke(FileTreeAPI.GET_FOLDER),
		[FileTreeAPI.UPDATE_FOLDER]: invoke(FileTreeAPI.UPDATE_FOLDER),
		[FileTreeAPI.MOVE_FOLDER]: invoke(FileTreeAPI.MOVE_FOLDER),
		[FileTreeAPI.CREATE_FILE]: invoke(FileTreeAPI.CREATE_FILE),
		[FileTreeAPI.GET_FILE]: invoke(FileTreeAPI.GET_FILE),
		[FileTreeAPI.UPDATE_FILE]: invoke(FileTreeAPI.UPDATE_FILE),
		[FileTreeAPI.SAVE_FILE]: invoke(FileTreeAPI.SAVE_FILE),
		[FileTreeAPI.MOVE_FILE]: invoke(FileTreeAPI.MOVE_FILE),
		[FileTreeAPI.DELETE_FILE]: invoke(FileTreeAPI.DELETE_FILE),
		[FileTreeAPI.DELETE_FOLDER]: invoke(FileTreeAPI.DELETE_FOLDER),
	} as IFileTreeAPI);
};
