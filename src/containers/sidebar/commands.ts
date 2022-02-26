import { registerCommands } from "@core/register-commands";

export default registerCommands([
	{
		icon: "HiOutlineSwitchHorizontal",
		name: "Toggle Sidebar",
		description: "Shows or hides the sidebar located on the left of the application window.",
		event: "@sidebar/toggle",
		shortcut: "CommandOrControl+B",
	},
]);
