import { ExplorerAction, ExplorerAPI } from "./explorer-renderer-api";
import { createFile } from "./folder/create-file";
import { createFolder } from "./folder/create-folder";
import { listFolder } from "./folder/list-folder";
import { openFolder } from "./folder/open-folder";
import { updateFolder } from "./folder/update-folder";
import { OrdoFolder } from "./types";
import { WindowState } from "../common/types";
import { join } from "path";
import { EditorMainAPI } from "../editor/editor-main-api";
import { EditorAction } from "../editor/editor-renderer-api";
import { getFolder } from "./folder/get-folder";
import { getFile } from "./folder/get-file";
import { getFolderOrParent } from "./folder/get-folder-or-parent";

let tree: OrdoFolder;

export const ExplorerMainAPI = (state: WindowState): typeof ExplorerAPI => ({
	[ExplorerAction.OPEN_FOLDER]: async () => {
		state.explorer.tree = await listFolder(openFolder(state.window));

		return state;
	},
	[ExplorerAction.SELECT]: async (path) => {
		state.explorer.selection = path;

		const tabIndex = state.editor.tabs.findIndex((tab) => tab.path === path);

		if (~tabIndex) {
			state.editor.currentTab = tabIndex;
		}

		return state;
	},
	[ExplorerAction.CREATE_FOLDER]: async ({ name, currentlySelectedPath }) => {
		state.explorer.tree = await createFolder(tree, currentlySelectedPath, name);
		return state;
	},
	[ExplorerAction.GET_FOLDER]: async (path) => {
		return getFolder(tree, path);
	},
	[ExplorerAction.UPDATE_FOLDER]: async ({ path, update }) => {
		state.explorer.tree = await updateFolder(tree, path, update);
		return state;
	},
	[ExplorerAction.DELETE_FOLDER]: async (path) => {
		// TODO: Ask for removal and remove file
		return state;
	},
	[ExplorerAction.MOVE_FOLDER]: async ({ oldPath, newPath }) => {
		// TODO: Implement moving
		return state;
	},

	[ExplorerAction.CREATE_FILE]: async ({ name, currentlySelectedPath }) => {
		state.explorer.tree = await createFile(tree, currentlySelectedPath, name);
		const parent = getFolderOrParent(tree, currentlySelectedPath);
		const filePath = join(parent.path, name);

		return EditorMainAPI(state)[EditorAction.ADD_TAB](filePath);
	},
	[ExplorerAction.GET_FILE]: async (path) => {
		return getFile(tree, path);
	},
	[ExplorerAction.UPDATE_FILE]: async ({ path, update }) => {
		// TODO: Is there a file update?
		return state;
	},
	[ExplorerAction.DELETE_FILE]: async (path) => {
		// TODO: Ask for removal and remove file
		return state;
	},
	[ExplorerAction.MOVE_FILE]: async ({ oldPath, newPath }) => {
		// TODO: Implement moving
		return state;
	},
});
