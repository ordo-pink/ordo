import { ActivityBarState } from "./types"

const initialState: ActivityBarState = {
	show: true,
	current: undefined,
	topItems: [
		{ show: true, name: "Editor", icon: "HiOutlineDocumentText" },
		{ show: true, name: "Graph", icon: "HiOutlineShare" },
		{ show: true, name: "Find In Files", icon: "HiOutlineSearch" },
	],
	bottomItems: [{ show: true, name: "Settings", icon: "HiOutlineCog" }],
}

export default initialState
