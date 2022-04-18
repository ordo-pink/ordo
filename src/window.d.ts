<<<<<<< HEAD
<<<<<<< HEAD
import { EditorAPI, EDITOR_API } from "./editor/editor-renderer-api";
import { SettingsAPI, SETTINGS_API } from "./configuration/settings-renderer-api";
import { ExplorerAPI, EXPLORER_API } from "./explorer/explorer-renderer-api";

declare global {
	interface Window {
		[EDITOR_API]: typeof EditorAPI;
		[SETTINGS_API]: typeof SettingsAPI;
		[EXPLORER_API]: typeof ExplorerAPI;
	}
=======
import type { ApplicationEvent } from "@modules/application/types";
import type { ActivityBarEvent } from "@containers/activity-bar/types";
import type { CommanderEvent } from "@containers/commander/types";
import type { SidebarEvent } from "@containers/sidebar/types";
import type { WorkspaceEvent } from "@containers/workspace/types";
import type { EditorEvent } from "@modules/editor/types";

declare global {
	interface Window {
		ordo: {
			emit: <K extends keyof OrdoEvent>(event: K, arg?: OrdoEvent[K]) => void;
		};
	}
	type OrdoEvent = ApplicationEvent & ActivityBarEvent & CommanderEvent & SidebarEvent & WorkspaceEvent & EditorEvent;
>>>>>>> ordo/main
=======
import { TStore } from "@core/utils/store";
import { BrowserWindow, Dialog } from "electron";
import { Draft } from "immer";
import { app } from "electron";

declare global {
	declare interface Window {
		ordo: {
			emit: <T, K = any>(event: string, payload?: K) => Promise<T>;
		};
	}

	declare type int = number;
	declare type uint = number;
	declare type float = number;
>>>>>>> ordo-app/main
}
