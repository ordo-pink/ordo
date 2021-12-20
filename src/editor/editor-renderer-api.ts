import type { Change, ChangeResponse } from "./types";

import { ipcRenderer } from "electron";
import { OrdoFile } from "../explorer/types";

export const EDITOR_API = "Editor";

export enum EditorAction {
	ON_KEY_DOWN = "onKeyDown",
	GET_CONTENT = "getContent",
}

export const EditorAPI = {
	[EditorAction.ON_KEY_DOWN]: (change: Change): Promise<ChangeResponse> =>
		ipcRenderer.invoke(EditorAction.ON_KEY_DOWN, change),
	[EditorAction.GET_CONTENT]: (file: OrdoFile): Promise<OrdoFile & { body: string[] }> =>
		ipcRenderer.invoke(EditorAction.GET_CONTENT, file),
};
