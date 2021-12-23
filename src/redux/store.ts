import type { EditorOrdoFile } from "../common/types";

import { createAsyncThunk, createSlice, configureStore } from "@reduxjs/toolkit";
import { OrdoFolder } from "../explorer/types";

export const addTab = createAsyncThunk("CreateTab", window.Editor.addTab);
export const openTab = createAsyncThunk("OpenTab", window.Editor.openTab);
export const closeTab = createAsyncThunk("CloseTab", window.Editor.closeTab);

export const select = createAsyncThunk("Select", window.Explorer.select);
export const openFolder = createAsyncThunk("OpenFolder", window.Explorer.openFolder);
export const createFolder = createAsyncThunk("CreateFolder", window.Explorer.createFolder);
export const updateFolder = createAsyncThunk("UpdateFolder", window.Explorer.updateFolder);
export const deleteFolder = createAsyncThunk("DeleteFolder", window.Explorer.deleteFolder);
export const moveFolder = createAsyncThunk("MoveFolder", window.Explorer.moveFolder);
export const createFile = createAsyncThunk("CreateFile", window.Explorer.createFile);
export const updateFile = createAsyncThunk("UpdateFile", window.Explorer.updateFile);
export const deleteFile = createAsyncThunk("DeleteFile", window.Explorer.deleteFile);
export const moveFile = createAsyncThunk("MoveFile", window.Explorer.moveFile);

export type State = {
	tabs: EditorOrdoFile[];
	currentTab: number;

	explorerSelection: string;
	explorerTree: OrdoFolder;
};

const initialState: State = {
	tabs: null,
	currentTab: null,

	explorerTree: null,
	explorerSelection: null,
};

const state = createSlice({
	name: "state",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(addTab.fulfilled, (state, action) => {
			state.tabs = action.payload.editor.tabs;
			state.currentTab = action.payload.editor.currentTab;
			state.explorerSelection = action.payload.explorer.selection;
		});
		builder.addCase(openTab.fulfilled, (state, action) => {
			state.tabs = action.payload.editor.tabs;
			state.currentTab = action.payload.editor.currentTab;
			state.explorerSelection = action.payload.explorer.selection;
		});
		builder.addCase(closeTab.fulfilled, (state, action) => {
			state.tabs = action.payload.editor.tabs;
			state.currentTab = action.payload.editor.currentTab;
			state.explorerSelection = action.payload.explorer.selection;
		});

		builder.addCase(select.fulfilled, (state, action) => {
			state.tabs = action.payload.editor.tabs;
			state.currentTab = action.payload.editor.currentTab;
			state.explorerSelection = action.payload.explorer.selection;
		});
		builder.addCase(openFolder.fulfilled, (state, action) => {
			state.tabs = [];
			state.currentTab = null;
			state.explorerSelection = null;
			state.explorerTree = action.payload.explorer.tree;
		});
		builder.addCase(createFolder.fulfilled, (state, action) => {
			state.explorerTree = action.payload.explorer.tree;
			state.explorerSelection = action.payload.explorer.selection;
		});
		builder.addCase(updateFolder.fulfilled, (state, action) => {
			state.tabs = action.payload.editor.tabs;
			state.explorerTree = action.payload.explorer.tree;
			state.explorerSelection = action.payload.explorer.selection;
		});
		builder.addCase(deleteFolder.fulfilled, (state, action) => {
			state.tabs = action.payload.editor.tabs;
			state.currentTab = action.payload.editor.currentTab;
			state.explorerSelection = action.payload.explorer.selection;
			state.explorerTree = action.payload.explorer.tree;
		});
		builder.addCase(moveFolder.fulfilled, (state, action) => {
			state.tabs = action.payload.editor.tabs;
			state.explorerTree = action.payload.explorer.tree;
			state.explorerSelection = action.payload.explorer.selection;
		});
		builder.addCase(createFile.fulfilled, (state, action) => {
			state.tabs = action.payload.editor.tabs;
			state.currentTab = action.payload.editor.currentTab;
			state.explorerTree = action.payload.explorer.tree;
			state.explorerSelection = action.payload.explorer.selection;
		});
		builder.addCase(updateFile.fulfilled, (state, action) => {
			state.tabs = action.payload.editor.tabs;
			state.currentTab = action.payload.editor.currentTab;
			state.explorerTree = action.payload.explorer.tree;
			state.explorerSelection = action.payload.explorer.selection;
		});
		builder.addCase(deleteFile.fulfilled, (state, action) => {
			state.tabs = action.payload.editor.tabs;
			state.currentTab = action.payload.editor.currentTab;
			state.explorerTree = action.payload.explorer.tree;
			state.explorerSelection = action.payload.explorer.selection;
		});
		builder.addCase(moveFile.fulfilled, (state, action) => {
			state.tabs = action.payload.editor.tabs;
			state.currentTab = action.payload.editor.currentTab;
			state.explorerTree = action.payload.explorer.tree;
			state.explorerSelection = action.payload.explorer.selection;
		});
	},
});

export const store = configureStore({
	reducer: state.reducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
