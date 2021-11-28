import {
	createSlice,
	PayloadAction,
	createAsyncThunk,
	ActionReducerMapBuilder,
} from "@reduxjs/toolkit"
import { Hashed } from "../../../main/apis/hash-response"
import { ArbitraryFile, ArbitraryFolder } from "../../../global-context/types"
import { findNode, sortTree } from "../../../utils/tree"

export const fetchFileTree = createAsyncThunk("fileTree/init", (rootPath: string) =>
	window.fileSystemAPI.listFolder(rootPath),
)

export const getCurrentPathFromSettings = createAsyncThunk(
	"fileTree/get-current-path-from-settings",
	() => window.settingsAPI.get("application.last-open-file"),
)

export const createFileOrFolder = createAsyncThunk(
	"fileTree/create",
	(payload: { node: ArbitraryFolder; name: string }): Promise<ArbitraryFolder | ArbitraryFile> => {
		if (payload.name.endsWith("/")) {
			return window.fileSystemAPI.createFolder(payload.node, payload.name)
		} else {
			return window.fileSystemAPI.createFile(payload.node, payload.name)
		}
	},
)

export type FileTreeState = {
	status: "pending" | "fulfilled" | "rejected"
	rootPath: string
	currentPath: string
	tree: ArbitraryFolder
	errorMessage: string
}

const initialState: FileTreeState = {
	status: "pending",
	rootPath: null,
	currentPath: null,
	tree: null,
	errorMessage: "",
}

const fileTreeSlice = createSlice({
	name: "fileTree",
	initialState,
	reducers: {
		setRootPath: (state, action: PayloadAction<string>) => {
			state.rootPath = action.payload
		},
		setCurrentPath: (state, action: PayloadAction<string>) => {
			state.currentPath = action.payload
			window.settingsAPI.set("application.last-open-file", action.payload)
		},
	},
	extraReducers: (builder: ActionReducerMapBuilder<FileTreeState>) => {
		builder.addCase(
			fetchFileTree.fulfilled,
			(state, action: PayloadAction<Hashed<ArbitraryFolder>>) => {
				state.status = "fulfilled"
				state.tree = action.payload
				state.errorMessage = ""
			},
		)

		builder.addCase(fetchFileTree.rejected, (state) => {
			state.status = "rejected"
			state.errorMessage = "Could not open the root folder"
		})

		builder.addCase(fetchFileTree.pending, (state) => {
			state.status = "pending"
		})

		builder.addCase(
			createFileOrFolder.fulfilled,
			(state, action: PayloadAction<ArbitraryFolder | ArbitraryFile>) => {
				const folderNode: ArbitraryFolder = findNode(state.tree, "path", action.payload.parent.path)

				folderNode.children.push(action.payload)

				state.tree = sortTree(state.tree)
			},
		)

		builder.addCase(
			getCurrentPathFromSettings.fulfilled,
			(state, action: PayloadAction<string>) => {
				state.currentPath = action.payload
			},
		)
	},
})

export const { setRootPath, setCurrentPath } = fileTreeSlice.actions

export default fileTreeSlice.reducer
