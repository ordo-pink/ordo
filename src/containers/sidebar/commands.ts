import { registerCommands } from "../../common/register-commands"
import { SidebarEvent } from "./types"

export default registerCommands<SidebarEvent>([
	{
		icon: "HiOutlineSwitchHorizontal",
		name: "Toggle Sidebar",
		description: "Shows or hides the sidebar located on the left of the application window.",
		event: ["@sidebar/toggle"],
		shortcut: "CommandOrControl+B",
	},
	{
		icon: "HiOutlineStatusOnline",
		name: "Show Sidebar",
		description: "Shows the sidebar located on the left of the application window.",
		event: ["@sidebar/show"],
	},
	{
		icon: "HiOutlineStatusOffline",
		name: "Hide Sidebar",
		description: "Hides the sidebar located on the left of the application window.",
		event: ["@sidebar/hide"],
	},
])
