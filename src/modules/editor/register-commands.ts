import { registerCommands } from "@core/transmission/register-ordo-commands";

export default registerCommands([
	{
		name: "Close Tab",
		description: "Close current tab.",
		event: "@editor/close-tab",
		icon: "HiOutlineX",
		accelerator: "CommandOrControl+W",
	},
]);
