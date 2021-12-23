import type { EditorOrdoFile } from "../common/types";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const addTab = createAsyncThunk("AddTab", window.Editor.addTab);
export const openTab = createAsyncThunk("OpenTab", window.Editor.openTab);
export const closeTab = createAsyncThunk("CloseTab", window.Editor.closeTab);
export const onKeyDown = createAsyncThunk("OnKeyDown", window.Editor.onKeyDown);

export type EditorState = {
	tabs: EditorOrdoFile[];
	currentTab: number;
};

const initialState: EditorState = {
	currentTab: null,
	tabs: [],
};

const editorSlice = createSlice({
	name: "file-tree",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(addTab.fulfilled, (state, action) => {
			state.tabs = action.payload.editor.tabs;
			state.currentTab = action.payload.editor.currentTab;
		});
		builder.addCase(addTab.fulfilled, (state, action) => {
			state.tabs = action.payload.editor.tabs;
			state.currentTab = action.payload.editor.currentTab;
		});
		builder.addCase(addTab.fulfilled, (state, action) => {
			state.tabs = action.payload.editor.tabs;
			state.currentTab = action.payload.editor.currentTab;
		});
		builder.addCase(onKeyDown.fulfilled, (state, action) => {
			state.tabs[state.currentTab] = action.payload.editor.tabs[state.currentTab];
		});
	},
});

export default editorSlice.reducer;
