import type { KeyboardShortcut } from "./keybindings/types";

import { MenuItemConstructorOptions } from "electron";
import { Pipe } from "or-pipets";

import { KeybindableAction } from "./keybindings/keybindable-action";

const toMenuItem = ({ label, accelerator, action }: KeyboardShortcut) => ({
	label,
	accelerator,
	click: () => action(),
});

const separator = { type: "separator" };

const macMenu = (isMac: boolean) =>
	isMac
		? ([
				{
					label: "ORDO",
					submenu: [{ role: "about" }],
				},
		  ] as MenuItemConstructorOptions[])
		: ([] as MenuItemConstructorOptions[]);

const getFileMenu = (keybindings: any) =>
	({
		label: "&File",
		submenu: [
			toMenuItem(keybindings[KeybindableAction.OPEN]),
			separator,
			toMenuItem(keybindings[KeybindableAction.NEW_FILE]),
			toMenuItem(keybindings[KeybindableAction.NEW_WINDOW]),
			separator,
			toMenuItem(keybindings[KeybindableAction.CLOSE_TAB]),
			toMenuItem(keybindings[KeybindableAction.CLOSE_WINDOW]),
		],
	} as MenuItemConstructorOptions);

const getEditMenu = (keybindings: any) =>
	({
		label: "&Edit",
		submenu: [
			toMenuItem(keybindings[KeybindableAction.UNDO]),
			toMenuItem(keybindings[KeybindableAction.REDO]),
			separator,
			toMenuItem(keybindings[KeybindableAction.CUT]),
			toMenuItem(keybindings[KeybindableAction.COPY]),
			toMenuItem(keybindings[KeybindableAction.PASTE]),
			separator,
			toMenuItem(keybindings[KeybindableAction.FIND]),
			separator,
			toMenuItem(keybindings[KeybindableAction.FIND_IN_FILES]),
		],
	} as MenuItemConstructorOptions);

const getViewMenu = (keybindings: any) =>
	({
		label: "&View",
		submenu: [
			toMenuItem(keybindings[KeybindableAction.RESTART_WINDOW]),
			toMenuItem(keybindings[KeybindableAction.TOGGLE_DEV_TOOLS]),
			separator,
			toMenuItem(keybindings[KeybindableAction.EXPLORER]),
			toMenuItem(keybindings[KeybindableAction.GRAPH]),
			toMenuItem(keybindings[KeybindableAction.FINDER]),
			separator,
			toMenuItem(keybindings[KeybindableAction.SETTINGS]),
		],
	} as MenuItemConstructorOptions);

const getSelectionMenu = (keybindings: any) =>
	({
		label: "&Selection",
		submenu: [toMenuItem(keybindings[KeybindableAction.SELECT_ALL])],
	} as MenuItemConstructorOptions);

const extendArray =
	<T>(content: T) =>
	(arr: T[]): T[] =>
		[...arr, content];

export const getApplicationMenu = (keybindings: any) =>
	Pipe.of(macMenu)
		.pipe(extendArray(getFileMenu(keybindings)))
		.pipe(extendArray(getEditMenu(keybindings)))
		.pipe(extendArray(getSelectionMenu(keybindings)))
		.pipe(extendArray(getViewMenu(keybindings))).process;
