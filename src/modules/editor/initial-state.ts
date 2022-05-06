import { EditorState } from "@modules/editor/types";

const initialState: EditorState = {
	focused: false,
	tabs: [],
	currentTab: "",
};

export default initialState;
