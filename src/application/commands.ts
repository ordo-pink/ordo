import { registerCommands } from "../common/register-commands";

export default registerCommands([
	{
		icon: "HiOutlineFolderOpen",
		name: "Open Folder",
		description: "Open a different folder in current window.",
		event: "@application/open-folder",
		shortcut: "CommandOrControl+O",
	},
	{
		icon: "HiOutlineDocumentRemove",
		name: "Delete File",
		description: "Move current file to trash.",
		event: "@application/delete",
		shortcut: "CommandOrControl+Backspace",
	},
	{
		icon: "HiOutlineFolderOpen",
		name: "Reveal in Finder",
		description: "Reveal current file folder in the OS native file explorer.",
		event: "@application/reveal-in-finder",
		shortcut: "CommandOrControl+Alt+R",
	},
	{
		icon: "HiOutlineStop",
		name: "Close Window",
		description: "Close current window. This might not work though.",
		event: "@application/close-window",
		shortcut: "CommandOrControl+Shift+W",
	},
	{
		icon: "HiOutlineCode",
		name: "Toggle Dev Tools",
		description: "Show or hide browser developer tools.",
		event: "@application/toggle-dev-tools",
		shortcut: "CommandOrControl+Shift+I",
	},
	{
		icon: "HiOutlineRefresh",
		name: "Reload Window",
		description: "Reload current Ordo window.",
		event: "@application/reload-window",
		shortcut: "CommandOrControl+Shift+R",
	},
	{
		icon: "HiOutlineX",
		name: "Close File",
		description: "Closes currently open file.",
		event: "@application/close-file",
		shortcut: "CommandOrControl+W",
	},
	{
		icon: "HiOutlineSave",
		name: "Save File",
		description: "Save currently open file.",
		event: "@application/save-file",
		shortcut: "CommandOrControl+S",
	},
]);
