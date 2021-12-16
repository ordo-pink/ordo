import { EditorAPI, EDITOR_API } from "./editor/editor-renderer-api";

declare global {
	interface Window {
		[EDITOR_API]: typeof EditorAPI;
	}
}
