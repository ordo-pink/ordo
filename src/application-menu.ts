import { MenuItemConstructorOptions } from "electron";
import { Pipe } from "or-pipets";

import { KeybindableAction } from "./keybindings/keybindable-action";
import { WindowState } from "./common/types";

const toMenuItem = (action: KeybindableAction, state: WindowState) => ({
	label: state.keybindings[action].label,
	accelerator: state.keybindings[action].accelerator,
	click: () => state.keybindings[action].action(state),
});

const separator = { type: "separator" };

const macMenu = (state: WindowState) =>
	state.constants.isMac
		? ([
				{
					label: "ORDO",
					submenu: [
						{ role: "about" },
						separator,
						{ role: "services" },
						separator,
						{ role: "hide" },
						{ role: "hideOthers" },
						{ role: "unhide" },
						separator,
						{ role: "quit" },
					],
				},
		  ] as MenuItemConstructorOptions[])
		: ([] as MenuItemConstructorOptions[]);

const getFileMenu = (state: WindowState) =>
	({
		label: "&File",
		submenu: [
			toMenuItem(KeybindableAction.OPEN_FOLDER, state),
			{
				label: "Open Recent",
				role: "recentDocuments",
				submenu: [
					{
						label: "Clear Recent",
						role: "clearRecentDocuments",
					},
				],
			},
			separator,
			toMenuItem(KeybindableAction.NEW_FILE, state),
			// toMenuItem(KeybindableAction.NEW_WINDOW, state),
			separator,
			toMenuItem(KeybindableAction.CLOSE_TAB, state),
			{ role: "close" },
			// toMenuItem(KeybindableAction.CLOSE_WINDOW, state),
		],
	} as MenuItemConstructorOptions);

const getEditMenu = (state: WindowState) =>
	({
		label: "&Edit",
		submenu: [
			toMenuItem(KeybindableAction.UNDO, state),
			toMenuItem(KeybindableAction.REDO, state),
			separator,
			toMenuItem(KeybindableAction.CUT, state),
			toMenuItem(KeybindableAction.COPY, state),
			toMenuItem(KeybindableAction.PASTE, state),
			separator,
			toMenuItem(KeybindableAction.FIND, state),
			separator,
			toMenuItem(KeybindableAction.FIND_IN_FILES, state),
		],
	} as MenuItemConstructorOptions);

const getViewMenu = (state: WindowState) =>
	({
		label: "&View",
		submenu: [
			toMenuItem(KeybindableAction.RESTART_WINDOW, state),
			toMenuItem(KeybindableAction.TOGGLE_DEV_TOOLS, state),
			separator,
			toMenuItem(KeybindableAction.EXPLORER, state),
			toMenuItem(KeybindableAction.TOGGLE_EXPLORER, state),
			separator,
			toMenuItem(KeybindableAction.GRAPH, state),
			toMenuItem(KeybindableAction.FIND_IN_FILES, state),
			separator,
			toMenuItem(KeybindableAction.SETTINGS, state),
		],
	} as MenuItemConstructorOptions);

const getSelectionMenu = (state: WindowState) =>
	({
		label: "&Selection",
		submenu: [toMenuItem(KeybindableAction.SELECT_ALL, state)],
	} as MenuItemConstructorOptions);

const extendArray =
	<T>(content: T) =>
	(arr: T[]): T[] =>
		[...arr, content];

export const getApplicationMenu = (state: WindowState) =>
	Pipe.of(macMenu)
		.pipe(extendArray(getFileMenu(state)))
		.pipe(extendArray(getEditMenu(state)))
		.pipe(extendArray(getSelectionMenu(state)))
		.pipe(extendArray(getViewMenu(state)))
		.process(state);
