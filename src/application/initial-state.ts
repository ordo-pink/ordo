import { ApplicationState } from "./types";

const initialState: ApplicationState = {
	commands: [],
	cwd: "",
	currentFilePath: "",
	showDevTools: false,
	focusedComponent: "",
	openFiles: [],
	currentFile: 0,
};

export default initialState;
