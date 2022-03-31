import { OrdoFolder } from "@modules/editor/editor-slice";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { findOrdoFolder } from "./file-tree/find-ordo-folder";

export type FileExplorerState = {
	tree?: OrdoFolder | null;
	createFileIn?: string;
	createFolderIn?: string;
};

export const initialState: FileExplorerState = {
	tree: null,
};

export const selectProjectFolder = createAsyncThunk("select-project-folder", () =>
	window.ordo
		.emit<string>("@file-explorer/select-project-folder")
		.then((folder) => window.ordo.emit<OrdoFolder>("@file-explorer/list-folder", folder)),
);

export const listFolder = createAsyncThunk("list-folder", (path: string) =>
	window.ordo.emit<OrdoFolder>("@file-explorer/list-folder", path),
);

export const fileExplorerSlice = createSlice({
	name: "file-explorer",
	initialState,
	reducers: {
		showFileCreation: (state, action: PayloadAction<string>) => {
			if (!state.tree) {
				return;
			}

			const folder = findOrdoFolder(state.tree, action.payload);

			if (folder?.collapsed) {
				folder.collapsed = false;
			}

			state.createFileIn = action.payload;
		},
		showFolderCreation: (state, action: PayloadAction<string>) => {
			if (!state.tree) {
				return;
			}

			const folder = findOrdoFolder(state.tree, action.payload);

			if (folder?.collapsed) {
				folder.collapsed = false;
				window.ordo.emit("@file-explorer/update-folder", { path: folder.path, collapsed: folder.collapsed });
			}

			state.createFolderIn = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(selectProjectFolder.fulfilled, (state, action) => {
				state.tree = action.payload;
			})
			.addCase(selectProjectFolder.rejected, (state, action) => {
				// TODO: Send error notification
			})
			.addCase(listFolder.fulfilled, (state, action) => {
				state.tree = action.payload;
			})
			.addCase(listFolder.rejected, (state, action) => {
				// TODO: Send error notification
			});
	},
});

export const { showFileCreation, showFolderCreation } = fileExplorerSlice.actions;

export const fileExplorerReducer = fileExplorerSlice.reducer;
