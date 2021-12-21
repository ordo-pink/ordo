import { ipcRenderer } from "electron";
import { OrdoEntity, OrdoFolder } from "./types";

export const EXPLORER_API = "Explorer";

export enum ExplorerAction {
	OPEN_FOLDER = "openFolder",

	CREATE_FOLDER = "createFolder",
	GET_FOLDER = "getFolder",
	UPDATE_FOLDER = "updateFolder",
	DELETE_FOLDER = "deleteFolder",
	MOVE_FILE = "moveFile",

	CREATE_FILE = "createFile",
	GET_FOLDER_OR_PARENT = "getFolderOrParent",
	UPDATE_FILE = "updateFile",
	DELETE_FILE = "deleteFile",
	MOVE_FOLDER = "moveFolder",
}

export const ExplorerAPI = {
	[ExplorerAction.OPEN_FOLDER]: (): Promise<OrdoFolder> => ipcRenderer.invoke(ExplorerAction.OPEN_FOLDER),

	[ExplorerAction.CREATE_FOLDER]: (parentPath: string, path: string): Promise<OrdoFolder> =>
		ipcRenderer.invoke(ExplorerAction.CREATE_FOLDER, parentPath, path),
	[ExplorerAction.GET_FOLDER]: (): Promise<OrdoFolder> => ipcRenderer.invoke(ExplorerAction.GET_FOLDER),
	[ExplorerAction.UPDATE_FOLDER]: (path: string, update: Partial<OrdoFolder>): Promise<OrdoFolder> =>
		ipcRenderer.invoke(ExplorerAction.UPDATE_FOLDER, path, update),
	[ExplorerAction.DELETE_FOLDER]: (path: string): Promise<OrdoFolder> =>
		ipcRenderer.invoke(ExplorerAction.DELETE_FOLDER, path),
	[ExplorerAction.MOVE_FOLDER]: (oldPath: string, newPath: string): Promise<OrdoFolder> =>
		ipcRenderer.invoke(ExplorerAction.MOVE_FOLDER, oldPath, newPath),

	[ExplorerAction.CREATE_FILE]: (parentPath: string, path: string): Promise<OrdoFolder> =>
		ipcRenderer.invoke(ExplorerAction.CREATE_FILE, parentPath, path),
	[ExplorerAction.GET_FOLDER_OR_PARENT]: (path: string): Promise<OrdoEntity> =>
		ipcRenderer.invoke(ExplorerAction.GET_FOLDER_OR_PARENT, path),
	[ExplorerAction.UPDATE_FILE]: (path: string): Promise<OrdoFolder> =>
		ipcRenderer.invoke(ExplorerAction.UPDATE_FILE, path),
	[ExplorerAction.DELETE_FILE]: (path: string): Promise<OrdoFolder> =>
		ipcRenderer.invoke(ExplorerAction.DELETE_FILE, path),
	[ExplorerAction.MOVE_FILE]: (oldPath: string, newPath: string): Promise<OrdoFolder> =>
		ipcRenderer.invoke(ExplorerAction.MOVE_FILE, oldPath, newPath),
};
