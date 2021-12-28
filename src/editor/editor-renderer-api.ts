import type { Change } from "./types";

import { ipcRenderer } from "electron";

export const EDITOR_API = "Editor";

export enum EditorAction {
	ADD_TAB = "addTab",
	CLOSE_TAB = "closeTab",
	OPEN_TAB = "openTab",
	ON_KEYDOWN = "onKeyDown",
}

type R = Promise<void>;

export const EditorAPI = {
	[EditorAction.ON_KEYDOWN]: (change: Change): R => ipcRenderer.invoke(EditorAction.ON_KEYDOWN, change),
	[EditorAction.ADD_TAB]: (path: string): R => ipcRenderer.invoke(EditorAction.ADD_TAB, path),
	[EditorAction.OPEN_TAB]: (index: number): R => ipcRenderer.invoke(EditorAction.OPEN_TAB, index),
	[EditorAction.CLOSE_TAB]: (index: number): R => ipcRenderer.invoke(EditorAction.CLOSE_TAB, index),
};
