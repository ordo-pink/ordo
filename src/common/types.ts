import { KeybindableAction } from "../keybindings/keybindable-action";
import { SettingsAPI } from "../configuration/types";
import { ChangeSelection } from "../editor/types";
import { OrdoFile, OrdoFolder } from "../explorer/types";
import { KeyboardShortcut } from "../keybindings/types";
import { BrowserWindow } from "electron";
import colors from "tailwindcss/colors";

export type TextBody = string[][];

export type EditorOrdoFile = OrdoFile & { body: TextBody; selection: ChangeSelection };

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
	appearance: {
		currentView: "editor" | "graph" | "settings";
		showExplorer: boolean;
		fontFamily: string;
		tabSize: number;
		fontSize: number;
		accentColor: keyof typeof colors;
	};
};
