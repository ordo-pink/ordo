import { ApplicationState } from "./types"

const initialState: ApplicationState = {
	commands: [],
	cwd: "",
	showDevTools: false,
	openFiles: [],
	currentFile: 0,
}

export default initialState
