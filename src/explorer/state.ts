import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrdoFolder } from "./types";

export const getFolder = createAsyncThunk("GetFolder", () => window.Explorer.getFolder());
export const updateFolder = createAsyncThunk("UpdateFolder", (change: { path: string; update: Partial<OrdoFolder> }) =>
	window.Explorer.updateFolder(change.path, change.update),
);

export type ExplorerState = {
	selected: string;
	tree: OrdoFolder;
};

const initialState: ExplorerState = {
	selected: null,
	tree: null,
};

const explorerSlice = createSlice({
	name: "file-tree",
	initialState,
	reducers: {
		select: (state, action: PayloadAction<string>) => {
			state.selected = action.payload;
		},
		setTree: (state, action: PayloadAction<OrdoFolder>) => {
			state.tree = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(updateFolder.fulfilled, (state, action) => {
			state.tree = action.payload;
		});
		builder.addCase(getFolder.fulfilled, (state, action) => {
			state.tree = action.payload;
		});
	},
});

export const { select, setTree } = explorerSlice.actions;
export default explorerSlice.reducer;
