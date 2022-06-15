import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
	{
		name: "Close Tab",
		description: "Close current tab.",
		event: "@editor/close-tab",
		icon: "HiOutlineX",
		accelerator: "CommandOrControl+W",
	},
	{
		name: "Select All",
		description: "Select everything in the file",
		event: "@editor/select-all",
		icon: "HiOutlineSelector",
		accelerator: "CommandOrControl+A",
	},
	{
		name: "Copy",
		description: "Copy selection",
		event: "@editor/copy",
		icon: "HiOutlineClipboardCopy",
		accelerator: "CommandOrControl+C",
	},
	{
		name: "Cut",
		description: "Cut selection",
		event: "@editor/cut",
		icon: "HiOutlineScissors",
		accelerator: "CommandOrControl+X",
	},
	{
		name: "Paste",
		description: "Paste text",
		event: "@editor/paste",
		icon: "HiOutlineClipboardList",
		accelerator: "CommandOrControl+V",
	},
]);
