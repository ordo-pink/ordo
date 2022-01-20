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
	{
		icon: "HiOutlineFolderOpen",
		name: "Open Folder",
		description: "Open a different folder in current window.",
		event: ["@application/open-folder"],
		shortcut: "CommandOrControl+O",
	},
	{
		icon: "HiOutlineStop",
		name: "Close Window",
		description: "Close current window. This might not work though.",
		event: ["@application/close-window"],
		shortcut: "CommandOrControl+Shift+W",
	},
	{
		icon: "HiOutlineCode",
		name: "Toggle Dev Tools",
		description: "Show or hide browser developer tools.",
		event: ["@application/toggle-dev-tools"],
		shortcut: "CommandOrControl+Shift+I",
	},
	{
		icon: "HiOutlineDesktopComputer",
		name: "Reload Window",
		description: "Reload current Ordo window.",
		event: ["@application/reload-window"],
		shortcut: "CommandOrControl+Shift+R",
	},
])
