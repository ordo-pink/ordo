import { registerCommands } from "../../common/register-commands"
import { ActivityBarEvent } from "./types"

export default registerCommands<ActivityBarEvent>([
	{
		icon: "HiOutlineSwitchHorizontal",
		name: "Toggle Activity Bar",
		description: "Shows or hides the activity bar located on the left of the application window.",
		event: ["@activity-bar/toggle"],
		shortcut: "CommandOrControl+Shift+B",
	},
	{
		icon: "HiOutlineStatusOnline",
		name: "Show Activity Bar",
		description: "Shows the activity bar located on the left of the application window.",
		event: ["@activity-bar/show"],
	},
	{
		icon: "HiOutlineStatusOffline",
		name: "Hide Activity Bar",
		description: "Hides the activity bar located on the left of the application window.",
		event: ["@activity-bar/hide"],
	},
])
