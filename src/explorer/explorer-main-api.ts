import { ExplorerAction, ExplorerAPI } from "./explorer-renderer-api";
import { createFile } from "./folder/create-file";
import { createFolder } from "./folder/create-folder";
import { listFolder } from "./folder/list-folder";
import { openFolder } from "./folder/open-folder";
import { updateFolder } from "./folder/update-folder";
import { WindowState } from "../common/types";
import { join } from "path";
import { EditorMainAPI } from "../editor/editor-main-api";
import { EditorAction } from "../editor/editor-renderer-api";
import { getFolder } from "./folder/get-folder";
import { getFile } from "./folder/get-file";
import { getFolderOrParent } from "./folder/get-folder-or-parent";
import { saveFile } from "./folder/save-file";
import { toReduxState } from "../common/to-redux-state";

export const ExplorerMainAPI = (state: WindowState): typeof ExplorerAPI => ({
	[ExplorerAction.OPEN_FOLDER]: async (path?: string) => {
		state.explorer.tree = await listFolder(path ? path : openFolder(state.window));
		state.explorer.selection = null;
		state.editor.tabs = [];
		state.editor.currentTab = null;

		state.settings.set("last-window.folder", state.explorer.tree.path);

		state.window.setRepresentedFilename(state.explorer.tree.path);
		state.window.setTitle(`${state.explorer.tree.readableName}`);

		state.window.webContents.send("SetState", toReduxState(state));
	},
	[ExplorerAction.SELECT]: async (path) => {
		state.explorer.selection = path;

		const tabIndex = state.editor.tabs.findIndex((tab) => tab.path === path);

		if (~tabIndex) {
			state.editor.currentTab = tabIndex;
		} else {
			EditorMainAPI(state)[EditorAction.ADD_TAB](path);
		}

		state.window.webContents.send("SetState", toReduxState(state));
	},

	[ExplorerAction.SAVE_FILE]: async () => {
		const file = state.editor.tabs[state.editor.currentTab];

		if (file.type === "image") {
			return;
		}
		await saveFile(file.path, (file.body as string[][]).map((line) => line.slice(0, -1).join("")).join("\n"));
		state.window.setDocumentEdited(false);
	},

	[ExplorerAction.CREATE_FOLDER]: async ({ name, currentlySelectedPath }) => {
		if (!currentlySelectedPath) {
			currentlySelectedPath = state.explorer.tree.path;
		}

		state.explorer.tree = await createFolder(state.explorer.tree, currentlySelectedPath, name);
		state.window.webContents.send("SetState", toReduxState(state));
	},
	[ExplorerAction.GET_FOLDER]: async (path) => {
		return getFolder(state.explorer.tree, path);
	},
	[ExplorerAction.UPDATE_FOLDER]: async ({ path, update }) => {
		state.explorer.tree = await updateFolder(state.explorer.tree, path, update);
		state.window.webContents.send("SetState", toReduxState(state));
	},
	[ExplorerAction.DELETE_FOLDER]: async (path) => {
		// TODO: Ask for removal and remove file
	},
	[ExplorerAction.MOVE_FOLDER]: async ({ oldPath, newPath }) => {
		// TODO: Implement moving
	},

	[ExplorerAction.CREATE_FILE]: async ({ name, currentlySelectedPath }) => {
		if (!currentlySelectedPath) {
			currentlySelectedPath = state.explorer.tree.path;
		}

		state.explorer.tree = await createFile(state.explorer.tree, currentlySelectedPath, name);
		const parent = getFolderOrParent(state.explorer.tree, currentlySelectedPath);
		const filePath = join(parent.path, name);

		EditorMainAPI(state)[EditorAction.ADD_TAB](filePath);
		state.window.webContents.send("SetState", toReduxState(state));
	},
	[ExplorerAction.GET_FILE]: async (path) => {
		return getFile(state.explorer.tree, path);
	},
	[ExplorerAction.UPDATE_FILE]: async ({ path, update }) => {
		// TODO: Is there a file update?
	},
	[ExplorerAction.DELETE_FILE]: async (path) => {
		// TODO: Ask for removal and remove file
	},
	[ExplorerAction.MOVE_FILE]: async ({ oldPath, newPath }) => {
		// TODO: Implement moving
	},
});
