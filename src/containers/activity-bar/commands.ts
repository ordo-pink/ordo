import { registerCommands } from "../../common/register-commands";

export default registerCommands([
	{
		icon: "HiOutlineSwitchHorizontal",
		name: "Toggle Activity Bar",
		description: "Shows or hides the activity bar located on the left of the application window.",
		event: "@activity-bar/toggle",
		shortcut: "CommandOrControl+Shift+B",
	},
	{
		icon: "HiOutlineStatusOnline",
		name: "Show Activity Bar",
		description: "Shows the activity bar located on the left of the application window.",
		event: "@activity-bar/show",
	},
	{
		icon: "HiOutlineStatusOffline",
		name: "Hide Activity Bar",
		description: "Hides the activity bar located on the left of the application window.",
		event: "@activity-bar/hide",
	},
	{
		icon: "HiOutlineDocument",
		name: "Open Editor",
		description: "Switch to Editor view.",
		event: "@activity-bar/open-editor",
		shortcut: "CommandOrControl+Shift+E",
	},
	{
		icon: "HiOutlineShare",
		name: "Open Graph",
		description: "Switch to Graph view.",
		event: "@activity-bar/open-graph",
		shortcut: "CommandOrControl+Shift+G",
	},
	{
		icon: "HiOutlineSearch",
		name: "Open Find in Files",
		description: "Switch to Find in Files view.",
		event: "@activity-bar/open-find-in-files",
		shortcut: "CommandOrControl+Shift+F",
	},
	{
		icon: "HiOutlineCog",
		name: "Open Settings",
		description: "Open Settings.",
		event: "@activity-bar/open-settings",
		shortcut: "CommandOrControl+,",
	},
]);
