import { registerCommands } from "../common/register-commands"
import { ApplicationEvent } from "./types"

export default registerCommands<ApplicationEvent>([
	{
		icon: "HiOutlineRefresh",
		name: "Refresh Application State",
		description: "Triggers forceful application state update.",
		event: ["@application/get-state"],
		shortcut: "CommandOrControl+Shift+R",
	},
])
