import { EditorAPI, EDITOR_API } from "./editor/editor-renderer-api";
import { SettingsAPI, SETTINGS_API } from "./configuration/settings-renderer-api";
import { ExplorerAPI, EXPLORER_API } from "./explorer/explorer-renderer-api";

declare global {
	interface Window {
		[EDITOR_API]: typeof EditorAPI;
		[SETTINGS_API]: typeof SettingsAPI;
		[EXPLORER_API]: typeof ExplorerAPI;
	}
}
