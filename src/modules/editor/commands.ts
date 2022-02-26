import { registerCommands } from "@core/register-commands";

export default registerCommands([
	{
		icon: "HiSelector",
		name: "Select All",
		description: "Selects everything in the document.",
		event: "@editor/select-all",
		shortcut: "CommandOrControl+A",
	},
]);
