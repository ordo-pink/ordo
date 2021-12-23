import type { BrowserWindow } from "electron";
import { SettingsAPI } from "../configuration/types";
import { ChangeSelection } from "../editor/types";
import { OrdoFile, OrdoFolder } from "../explorer/types";
import { KeyboardShortcut } from "../keybindings/types";

export type EditorOrdoFile = OrdoFile & { body: string[]; selection: ChangeSelection };

export type WindowState = {
	settings: SettingsAPI;
	window: BrowserWindow;
	editor: {
		tabs: EditorOrdoFile[];
		currentTab: number;
	};
	keyBindings: KeyboardShortcut[];
	explorer: {
		selection: string;
		tree: OrdoFolder;
	};
};
