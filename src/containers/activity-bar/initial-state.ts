import { ActivityBarState } from "./types"

const initialState: ActivityBarState = {
	show: true,
	topItems: [
		{ show: true, name: "Editor", icon: "HiOutlineDocumentText" },
		{ show: true, name: "Graph", icon: "HiOutlineShare" },
		{ show: true, name: "Find In Files", icon: "HiOutlineSearch" },
	],
	bottomItems: [{ show: true, name: "Graph", icon: "HiOutlineCog" }],
}

export default initialState
