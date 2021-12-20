import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrdoFile } from "../explorer/types";

export const createTab = createAsyncThunk("CreateTab", (file: OrdoFile) => window.Editor.getContent(file));

export type EditorState = {
	tabs: Array<OrdoFile & { body: string }>;
	currentTab: number;
};

const initialState: EditorState = {
	currentTab: null,
	tabs: [],
};

const editorSlice = createSlice({
	name: "file-tree",
	initialState,
	reducers: {
		openTab: (state, action: PayloadAction<number>) => {
			state.currentTab = action.payload;
		},
		closeTab: (state, action: PayloadAction<number>) => {
			state.tabs.splice(action.payload, 1);

			if (state.currentTab >= state.tabs.length) {
				state.currentTab -= 1;
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(createTab.fulfilled, (state, action) => {
			const tabIndex = state.tabs.findIndex((tab) => tab.path === action.payload.path);

			if (tabIndex !== -1) {
				state.currentTab = tabIndex;
			} else {
				state.tabs.push(action.payload);
				state.currentTab = state.tabs.length - 1;
			}
		});
	},
});

export const { openTab, closeTab } = editorSlice.actions;
export default editorSlice.reducer;
