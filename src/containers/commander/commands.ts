import { registerCommands } from "../../common/register-commands"

export default registerCommands([
	{
		icon: "HiOutlineRefresh",
		name: "Toggle Commander",
		description: "Shows or hides the activity bar located on the left of the application window.",
		event: "@commander/toggle",
		shortcut: "CommandOrControl+Shift+P",
	},
])
