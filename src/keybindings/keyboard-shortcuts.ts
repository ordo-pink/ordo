import type { KeyboardShortcut } from "./types";

import { KeybindableAction } from "./keybindable-action";
import { BrowserWindow } from "electron";

export const KeyboardShortcuts: Record<KeybindableAction, KeyboardShortcut> = {
	[KeybindableAction.OPEN]: {
		label: "Open",
		accelerator: "CommandOrControl+O",
		action: () => console.log("Open Folder"),
	},
	[KeybindableAction.NEW_FILE]: {
		label: "New File",
		accelerator: "CommandOrControl+N",
		action: () => console.log("Create File"),
	},
	[KeybindableAction.NEW_WINDOW]: {
		label: "New Window",
		accelerator: "CommandOrControl+Shift+N",
		action: () => console.log("New Window"),
	},
	[KeybindableAction.SAVE_FILE]: {
		label: "Save File",
		accelerator: "CommandOrControl+S",
		action: () => console.log("Save File"),
	},
	[KeybindableAction.SAVE_AS]: {
		label: "Save As...",
		accelerator: "CommandOrControl+Shift+S",
		action: () => console.log("Save As"),
	},
	[KeybindableAction.CLOSE_TAB]: {
		label: "Close Tab",
		accelerator: "CommandOrControl+W",
		action: () => console.log("Close Tab"),
	},
	[KeybindableAction.CLOSE_WINDOW]: {
		label: "Close Window",
		accelerator: "CommandOrControl+Shift+W",
		action: (window: BrowserWindow) => console.log(`Close window ${window.id}`),
	},
	[KeybindableAction.FINDER]: {
		label: "Search",
		accelerator: "CommandOrControl+P",
		action: () => console.log("Finder"),
	},
	[KeybindableAction.EXPLORER]: {
		label: "Explorer",
		accelerator: "CommandOrControl+Shift+E",
		action: () => console.log("Explorer"),
	},
	[KeybindableAction.GRAPH]: {
		label: "Graph",
		accelerator: "CommandOrControl+Shift+G",
		action: () => console.log("Graph"),
	},
	[KeybindableAction.SETTINGS]: {
		label: "Settings",
		accelerator: "CommandOrControl+,",
		action: () => console.log("Settings"),
	},
	[KeybindableAction.TOGGLE_DEV_TOOLS]: {
		label: "Toggle Dev Tools",
		accelerator: "CommandOrControl+Shift+I",
		action: () => console.log("Toggle dev tools"),
	},
	[KeybindableAction.RESTART_WINDOW]: {
		label: "Restart Window",
		accelerator: "CommandOrControl+R",
		action: () => console.log("Restart window"),
	},
	[KeybindableAction.CUT]: {
		label: "Cut",
		accelerator: "CommandOrControl+X",
		action: () => console.log("Cut"),
	},
	[KeybindableAction.COPY]: {
		label: "Copy",
		accelerator: "CommandOrControl+C",
		action: () => console.log("Copy"),
	},
	[KeybindableAction.PASTE]: {
		label: "Paste",
		accelerator: "CommandOrControl+V",
		action: () => console.log("Paste"),
	},
	[KeybindableAction.UNDO]: {
		label: "Undo",
		accelerator: "CommandOrControl+Z",
		action: () => console.log("Undo"),
	},
	[KeybindableAction.REDO]: {
		label: "Redo",
		accelerator: "CommandOrControl+Shift+Z",
		action: () => console.log("Redo"),
	},
	[KeybindableAction.FIND]: {
		label: "Find",
		accelerator: "CommandOrControl+F",
		action: () => console.log("Find"),
	},
	[KeybindableAction.FIND_IN_FILES]: {
		label: "Find in Files",
		accelerator: "CommandOrControl+Shift+F",
		action: () => console.log("Find in Files"),
	},
	[KeybindableAction.SELECT_ALL]: {
		label: "Select All",
		accelerator: "CommandOrControl+A",
		action: () => console.log("Select All"),
	},
};
