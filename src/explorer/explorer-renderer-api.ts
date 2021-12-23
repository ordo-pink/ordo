import { ipcRenderer } from "electron";
import { WindowState } from "../common/types";
import { OrdoFile, OrdoFolder } from "./types";

export const EXPLORER_API = "Explorer";

export enum ExplorerAction {
	OPEN_FOLDER = "openFolder",
	SELECT = "select",

	CREATE_FOLDER = "createFolder",
	GET_FOLDER = "getFolder",
	UPDATE_FOLDER = "updateFolder",
	DELETE_FOLDER = "deleteFolder",
	MOVE_FILE = "moveFile",

	CREATE_FILE = "createFile",
	GET_FILE = "getFile",
	UPDATE_FILE = "updateFile",
	DELETE_FILE = "deleteFile",
	MOVE_FOLDER = "moveFolder",
}

export const ExplorerAPI = {
	[ExplorerAction.OPEN_FOLDER]: (): Promise<WindowState> => ipcRenderer.invoke(ExplorerAction.OPEN_FOLDER),
	[ExplorerAction.SELECT]: (path: string): Promise<WindowState> => ipcRenderer.invoke(ExplorerAction.SELECT, path),

	[ExplorerAction.CREATE_FOLDER]: (data: { name: string; currentlySelectedPath: string }): Promise<WindowState> =>
		ipcRenderer.invoke(ExplorerAction.CREATE_FOLDER, data),
	[ExplorerAction.GET_FOLDER]: (path: string): Promise<OrdoFolder> =>
		ipcRenderer.invoke(ExplorerAction.GET_FOLDER, path),
	[ExplorerAction.UPDATE_FOLDER]: (data: { path: string; update: Partial<OrdoFolder> }): Promise<WindowState> =>
		ipcRenderer.invoke(ExplorerAction.UPDATE_FOLDER, data),
	[ExplorerAction.DELETE_FOLDER]: (path: string): Promise<WindowState> =>
		ipcRenderer.invoke(ExplorerAction.DELETE_FOLDER, path),
	[ExplorerAction.MOVE_FOLDER]: (data: { oldPath: string; newPath: string }): Promise<WindowState> =>
		ipcRenderer.invoke(ExplorerAction.MOVE_FOLDER, data),

	[ExplorerAction.CREATE_FILE]: (data: { name: string; currentlySelectedPath: string }): Promise<WindowState> =>
		ipcRenderer.invoke(ExplorerAction.CREATE_FILE, data),
	[ExplorerAction.GET_FILE]: (path: string): Promise<OrdoFile> => ipcRenderer.invoke(ExplorerAction.GET_FILE, path),
	[ExplorerAction.UPDATE_FILE]: (data: { path: string; update: Partial<OrdoFile> }): Promise<WindowState> =>
		ipcRenderer.invoke(ExplorerAction.UPDATE_FILE, data),
	[ExplorerAction.DELETE_FILE]: (path: string): Promise<WindowState> =>
		ipcRenderer.invoke(ExplorerAction.DELETE_FILE, path),
	[ExplorerAction.MOVE_FILE]: (data: { oldPath: string; newPath: string }): Promise<WindowState> =>
		ipcRenderer.invoke(ExplorerAction.MOVE_FILE, data),
};
