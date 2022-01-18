import { CommanderState } from "./types"

const initialState: CommanderState = {
	show: true,
	items: [
		// TODO: Move ActivityBar commands to activity-bar
		{
			icon: "HiOutlineSwitchHorizontal",
			name: "Toggle Activity Bar",
			description: "Shows or hides the activity bar located on the left of the application window.",
		},
		{
			icon: "HiOutlineStatusOnline",
			name: "Show Activity Bar",
			description: "Shows the activity bar located on the left of the application window.",
		},
		{
			icon: "HiOutlineStatusOffline",
			name: "Hide Activity Bar",
			description: "Hides the activity bar located on the left of the application window.",
		},
	],
}

export default initialState
