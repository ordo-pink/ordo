import { registerCommands } from "../../common/register-commands"
import { CommanderEvent } from "./types"

export default registerCommands<CommanderEvent>([
	{
		icon: "HiOutlineRefresh",
		name: "Toggle Commander",
		description: "Shows or hides the activity bar located on the left of the application window.",
		event: ["@commander/toggle"],
		shortcut: "CommandOrControl+Shift+P",
	},
])
