import { KeybindableAction } from "../keybindings/keybindable-action";
import { SettingsAPI } from "../configuration/types";
import { ChangeSelection } from "../editor/types";
import { OrdoFile, OrdoFolder } from "../explorer/types";
import { KeyboardShortcut } from "../keybindings/types";
import { App, BrowserWindow } from "electron";

export type EditorOrdoFile = OrdoFile & { body: string[]; selection: ChangeSelection };

export type WindowState = {
	window: BrowserWindow;
	settings: SettingsAPI;
	editor: {
		tabs: EditorOrdoFile[];
		currentTab: number;
	};
	keybindings: Record<KeybindableAction, KeyboardShortcut>;
	explorer: {
		selection: string;
		tree: OrdoFolder;
	};
	constants: {
		readonly isMac: boolean;
	};
};
