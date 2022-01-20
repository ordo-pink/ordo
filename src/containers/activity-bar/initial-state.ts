import { ActivityBarState } from "./types"

const initialState: ActivityBarState = {
	show: true,
	current: undefined,
	topItems: [
		{ show: true, name: "Editor", icon: "HiOutlineDocumentText", openEvent: "@activity-bar/open-editor" },
		{ show: true, name: "Graph", icon: "HiOutlineShare", openEvent: "@activity-bar/open-graph" },
		{ show: true, name: "Find in Files", icon: "HiOutlineSearch", openEvent: "@activity-bar/open-find-in-files" },
	],
	bottomItems: [{ show: true, name: "Settings", icon: "HiOutlineCog", openEvent: "@activity-bar/open-settings" }],
}

export default initialState
