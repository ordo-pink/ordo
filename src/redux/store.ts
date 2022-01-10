import type { CurrentView, EditorOrdoFile, WindowState } from "../common/types";

import { createAsyncThunk, createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { OrdoFolder } from "../explorer/types";
import colors from "tailwindcss/colors";

export const addTab = createAsyncThunk("CreateTab", window.Editor.addTab);
export const openTab = createAsyncThunk("OpenTab", window.Editor.openTab);
export const closeTab = createAsyncThunk("CloseTab", window.Editor.closeTab);
export const onKeyDown = createAsyncThunk("OnKeyDown", window.Editor.onKeyDown);

export const select = createAsyncThunk("Select", window.Explorer.select);
export const openFolder = createAsyncThunk("OpenFolder", window.Explorer.openFolder);
export const saveFile = createAsyncThunk("OpenFolder", window.Explorer.saveFile);

export const createFolder = createAsyncThunk("CreateFolder", window.Explorer.createFolder);
export const getFolder = createAsyncThunk("GetFolder", window.Explorer.getFolder);
export const updateFolder = createAsyncThunk("UpdateFolder", window.Explorer.updateFolder);
export const deleteFolder = createAsyncThunk("DeleteFolder", window.Explorer.deleteFolder);
export const moveFolder = createAsyncThunk("MoveFolder", window.Explorer.moveFolder);
export const createFile = createAsyncThunk("CreateFile", window.Explorer.createFile);
export const getFile = createAsyncThunk("GetFile", window.Explorer.getFile);
export const updateFile = createAsyncThunk("UpdateFile", window.Explorer.updateFile);
export const deleteFile = createAsyncThunk("DeleteFile", window.Explorer.deleteFile);
export const moveFile = createAsyncThunk("MoveFile", window.Explorer.moveFile);

export type State = {
	tabs: EditorOrdoFile[];
	currentTab: number;

	explorerSelection: string;
	explorerTree: OrdoFolder;
	showCreateFile: boolean;
	showCreateFolder: boolean;

	showExplorer: boolean;

	currentView: CurrentView;
	editorSelected: boolean;
	accentColor: keyof typeof colors;
	fontFamily: string;
	fontSize: number;
	tabSize: number;
};

const initialState: State = {
	tabs: null,
	currentTab: null,

	explorerTree: null,
	explorerSelection: null,
	showCreateFile: false,
	showCreateFolder: false,

	showExplorer: false,

	editorSelected: true,
	accentColor: "pink",
	fontFamily: "",
	fontSize: 16,
	tabSize: 2,

	currentView: "editor",
};

const state = createSlice({
	name: "state",
	initialState,
	reducers: {
		setState: (state, action: PayloadAction<Partial<WindowState>>) => {
			if (action.payload.explorer) {
				state.explorerSelection = action.payload.explorer.selection;
				state.explorerTree = action.payload.explorer.tree;
			}

			if (action.payload.editor) {
				state.tabs = action.payload.editor.tabs;
				state.currentTab = action.payload.editor.currentTab;
			}

			if (action.payload.appearance) {
				state.currentView = action.payload.appearance.currentView;
				state.showExplorer = action.payload.appearance.showExplorer;
				state.accentColor = action.payload.appearance.accentColor;
				state.fontFamily = action.payload.appearance.fontFamily;
				state.fontSize = action.payload.appearance.fontSize;
				state.tabSize = action.payload.appearance.tabSize;
			}
		},
		setShowCreateFile: (state, action: PayloadAction<boolean>) => {
			state.showCreateFile = action.payload;
		},
		setShowCreateFolder: (state, action: PayloadAction<boolean>) => {
			state.showCreateFolder = action.payload;
		},
		setEditorSelection: (state, action: PayloadAction<boolean>) => {
			state.editorSelected = action.payload;
		},
		setCurrentView: (state, action: PayloadAction<CurrentView>) => {
			state.currentView = action.payload;
		},
	},
});

export const { setState, setShowCreateFile, setShowCreateFolder, setEditorSelection, setCurrentView } = state.actions;

export const store = configureStore({
	reducer: state.reducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
