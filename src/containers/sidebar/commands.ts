import { registerCommands } from "../../common/register-commands";

export default registerCommands([
	{
		icon: "HiOutlineSwitchHorizontal",
		name: "Toggle Sidebar",
		description: "Shows or hides the sidebar located on the left of the application window.",
		event: "@sidebar/toggle",
		shortcut: "CommandOrControl+B",
	},
]);
