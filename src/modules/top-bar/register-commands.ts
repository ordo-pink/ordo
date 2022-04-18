import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
	{
		icon: "HiOutlineCode",
		name: "Go to Line",
		description: "Move caret to given line block.",
		event: "@top-bar/open-go-to-line",
		accelerator: "Alt+G",
	},
	{
		icon: "HiOutlineCollection",
		name: "Go to Commands",
		description: "Open list of application commands.",
		event: "@top-bar/open-command-palette",
		accelerator: "CommandOrControl+Shift+P",
	},
	{
		icon: "HiOutlineSearchCircle",
		name: "Go to File",
		description: "Open flat list of all files in the project.",
		event: "@top-bar/open-go-to-file",
		accelerator: "CommandOrControl+P",
	},
	{
		icon: "HiOutlineSearch",
		name: "Search in File",
		description: "Search in the current file.",
		event: "@top-bar/open-search-in-file",
		accelerator: "CommandOrControl+F",
	},
]);
