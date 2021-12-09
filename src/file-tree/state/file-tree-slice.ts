import type { OrdoFile, OrdoFolder } from "../types";

import {
	createSlice,
	PayloadAction,
	createAsyncThunk,
	ActionReducerMapBuilder,
} from "@reduxjs/toolkit";

export const isFolder = (x: any): x is OrdoFolder =>
	x.type && x.type === "folder" && x.children && Array.isArray(x.children);

const sortTree = (tree: OrdoFolder): OrdoFolder => {
	tree.children = tree.children.sort((a, b) => {
		if (isFolder(a)) {
			sortTree(a);
		}

		if (isFolder(b)) {
			sortTree(b);
		}

		if (!isFolder(a) && isFolder(b)) {
			return 1;
		}

		if (isFolder(a) && !isFolder(b)) {
			return -1;
		}

		return a.readableName.localeCompare(b.readableName);
	});

	return tree as OrdoFolder;
};

export const selectRootFolder = createAsyncThunk("file-tree/select-root-folder", () =>
	window.FileTree.selectRootFolder(),
);
export const getCurrentPath = createAsyncThunk("file-tree/get-current-path", () =>
	window.settingsAPI.get("application.last-open-file"),
);
export const getRootPath = createAsyncThunk("file-tree/get-root-path", () =>
	window.settingsAPI
		.get("application.root-folder-path")
		.then((path) => window.FileTree.getFolder(path)),
);

export const createFolder = createAsyncThunk("file-tree/folder/create", (path: string) =>
	window.FileTree.createFolder(path),
);
export const getFolder = createAsyncThunk("file-tree/folder/get", (path: string) =>
	window.FileTree.getFolder(path),
);
export const updateFolder = createAsyncThunk(
	"file-tree/folder/update",
	(payload: { folder: OrdoFolder; increment: Partial<OrdoFolder> }) =>
		window.FileTree.updateFolder(payload.folder.path, payload.increment),
);
export const moveFolder = createAsyncThunk(
	"file-tree/folder/move",
	(payload: { oldPath: string; newPath: string }) =>
		window.FileTree.moveFolder(payload.oldPath, payload.newPath),
);
export const deleteFolder = createAsyncThunk("file-tree/folder/delete", (path: string) =>
	window.FileTree.deleteFolder(path),
);

export const createFile = createAsyncThunk("file-tree/file/create", (path: string) =>
	window.FileTree.createFile(path),
);
export const getFile = createAsyncThunk("file-tree/file/get", (path: string) =>
	window.FileTree.getFile(path),
);
export const updateFile = createAsyncThunk(
	"file-tree/file/update",
	(payload: { file: OrdoFile; increment: Partial<OrdoFile> }) =>
		window.FileTree.updateFile(payload.file.path, payload.increment),
);
export const saveFile = createAsyncThunk(
	"file-tree/file/save",
	(payload: { path: string; data: string }) => window.FileTree.saveFile(payload.path, payload.data),
);
export const moveFile = createAsyncThunk(
	"file-tree/file/move",
	(payload: { oldPath: string; newPath: string }) =>
		window.FileTree.moveFile(payload.oldPath, payload.newPath),
);
export const deleteFile = createAsyncThunk("file-tree/file/delete", (path: string) =>
	window.FileTree.deleteFile(path),
);

const updateTree = (state: FileTreeState, action: PayloadAction<OrdoFolder>) => {
	state.tree = sortTree(action.payload);
};

export type FileTreeState = {
	rootPath: string;
	currentPath: string;
	tree: OrdoFolder;
};

const initialState: FileTreeState = {
	rootPath: null,
	currentPath: null,
	tree: null,
};

const fileTreeSlice = createSlice({
	name: "file-tree",
	initialState,
	reducers: {
		setRootPath(state, action: PayloadAction<string>) {
			state.rootPath = action.payload;
		},
		setCurrentPath(state, action: PayloadAction<string>) {
			state.currentPath = action.payload;
			window.settingsAPI.set("application.last-open-file", action.payload);
		},
	},
	extraReducers: (builder: ActionReducerMapBuilder<FileTreeState>) => {
		builder.addCase(getRootPath.fulfilled, (state, action: any) => {
			state.rootPath = action.payload.path;
			state.tree = sortTree(action.payload);
		});

		builder.addCase(createFile.fulfilled, updateTree);
		builder.addCase(updateFile.fulfilled, updateTree);
		builder.addCase(deleteFile.fulfilled, updateTree);
		builder.addCase(moveFile.fulfilled, updateTree);

		builder.addCase(createFolder.fulfilled, updateTree);
		builder.addCase(getFolder.fulfilled, updateTree);
		builder.addCase(updateFolder.fulfilled, updateTree);
		builder.addCase(moveFolder.fulfilled, updateTree);
		builder.addCase(deleteFolder.fulfilled, updateTree);

		// builder.addCase(
		// 	createFileOrFolder.fulfilled,
		// 	(state, action: PayloadAction<OrdoFolder | OrdoFile>) => {
		// 		const folderNode = findNode(state.tree, "path", action.payload.parent) as OrdoFolder;

		// 		folderNode.children.push(action.payload);

		// 		state.tree = sortTree(state.tree);
		// 	},
		// );

		// builder.addCase(
		// 	getCurrentPath.fulfilled,
		// 	(state, action: PayloadAction<string>) => {
		// 		state.currentPath = action.payload;
		// 	},
		// );

		// builder.addCase(getRootPath.fulfilled, (state, action: PayloadAction<string>) => {
		// 	state.rootPath = action.payload;
		// });

		// builder.addCase(
		// 	deleteFileOrFolder.fulfilled,
		// 	(state, action: PayloadAction<{ deleted: boolean; node: OrdoFolder | OrdoFile }>) => {
		// 		if (!action.payload.deleted) {
		// 			return;
		// 		}

		// 		const removedNode = findNode(state.tree, "path", action.payload.node.path) as OrdoFolder;

		// 		const parent = getParentNode(state.tree, removedNode);

		// 		parent.children = parent.children.filter((child) => child.path !== removedNode.path);

		// 		if (state.currentPath === removedNode.path) {
		// 			state.currentPath = "";
		// 		}

		// 		state.tree = sortTree(state.tree);
		// 	},
		// );

		// builder.addCase(moveFileOrFolder.fulfilled, (state, action) => {
		// 	const parent = getParentNode(state.tree, action.payload.node);
		// 	const node: OrdoFolder | OrdoFile = findNode(state.tree, "path", action.payload.node.path);
		// 	parent.children = parent.children.filter((child) => child.path !== action.payload.node.path);

		// 	const fullPath = action.payload.newPath.endsWith("/")
		// 		? action.payload.newPath.slice(0, -1)
		// 		: action.payload.newPath;

		// 	const relativePath = fullPath.replace(state.tree.path, "");

		// 	const pathChunks = relativePath.split("/").slice(1, -1);

		// 	let currentNode: OrdoFolder | OrdoFile = state.tree;

		// 	if (pathChunks.length > 0) {
		// 		let i = 0;

		// 		while (i < pathChunks.length) {
		// 			const newPath: string = currentNode.path.endsWith("/")
		// 				? currentNode.path.concat(pathChunks[i])
		// 				: currentNode.path.concat("/").concat(pathChunks[i]);

		// 			if (isFolder(currentNode)) {
		// 				let found: OrdoFile | OrdoFolder = currentNode.children.find(
		// 					(child) => child.path === newPath,
		// 				);

		// 				if (!found) {
		// 					found = createOrdoFolder({
		// 						path: newPath,
		// 						parent: currentNode.path,
		// 						exists: false,
		// 					});

		// 					currentNode.children.push(found);
		// 				}

		// 				currentNode = found;
		// 			}

		// 			i++;
		// 		}
		// 	}

		// 	if (state.currentPath === node.path) {
		// 		state.currentPath = action.payload.newPath;
		// 	}

		// 	node.path = action.payload.newPath;

		// 	node.readableName = node.path.split("/").reverse()[0];

		// 	if (!isFolder(node)) {
		// 		node.extension = node.path.slice(node.path.lastIndexOf("."));
		// 		node.icon = ICON[node.extension] ?? "🛠";
		// 	}

		// 	if (isFolder(currentNode)) {
		// 		currentNode.children.push(node);
		// 	}

		// 	state.tree = sortTree(state.tree);
		// });
	},
});

export const { setRootPath, setCurrentPath } = fileTreeSlice.actions;

export default fileTreeSlice.reducer;
