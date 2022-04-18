import { FileExplorerState } from "@modules/file-explorer/types";

const initialState: FileExplorerState = {
	tree: null as any,
	createFileIn: "",
	createFolderIn: "",
};

export default initialState;
