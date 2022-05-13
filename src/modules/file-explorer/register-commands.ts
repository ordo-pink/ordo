import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
	{
		name: "Reveal in Files",
		description: "Show current file in OS file explorer.",
		event: "@file-explorer/reveal-in-finder",
		icon: "HiFolder",
		accelerator: "CommandOrControl+Alt+R",
	},
	{
		name: "Copy Path",
		description: "Copy current file path.",
		event: "@file-explorer/copy-path",
		icon: "HiOutlineClipboardCopy",
		accelerator: "CommandOrControl+Alt+C",
	},
]);
