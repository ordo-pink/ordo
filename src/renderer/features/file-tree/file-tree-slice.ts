import {
	createSlice,
	PayloadAction,
	createAsyncThunk,
	ActionReducerMapBuilder,
} from "@reduxjs/toolkit"
import { Hashed } from "../../../main/apis/hash-response"
import { ArbitraryFile, ArbitraryFolder } from "../../../global-context/types"
import { findNode, getParentNode, sortTree } from "../../../utils/tree"
import { createArbitraryFolder, isFolder } from "../../../global-context/init"

export const fetchFileTree = createAsyncThunk("fileTree/init", (rootPath: string) =>
	window.fileSystemAPI.listFolder(rootPath),
)

export const getCurrentPathFromSettings = createAsyncThunk(
	"fileTree/getCurrentPathFromSettings",
	() => window.settingsAPI.get("application.last-open-file"),
)

export const getRootPathFromSettings = createAsyncThunk("fileTree/getRootPathFromSettings", () =>
	window.settingsAPI.get("application.root-folder-path"),
)

export const deleteFileOrFolder = createAsyncThunk(
	"filTree/delete",
	(
		node: ArbitraryFolder | ArbitraryFile,
	): Promise<{ deleted: boolean; node: ArbitraryFolder | ArbitraryFile }> =>
		window.fileSystemAPI.delete(node.path).then((deleted) => ({
			deleted,
			node,
		})),
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

export const moveFileOrFolder = createAsyncThunk(
	"fileTree/move",
	(payload: {
		node: ArbitraryFolder | ArbitraryFile
		newPath: string
	}): Promise<{ node: ArbitraryFolder | ArbitraryFile; newPath: string }> =>
		window.fileSystemAPI.move(payload.node.path, payload.newPath).then(() => {
			return payload
		}),
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

		builder.addCase(getRootPathFromSettings.fulfilled, (state, action: PayloadAction<string>) => {
			state.rootPath = action.payload
		})

		builder.addCase(
			deleteFileOrFolder.fulfilled,
			(
				state,
				action: PayloadAction<{ deleted: boolean; node: ArbitraryFolder | ArbitraryFile }>,
			) => {
				if (!action.payload.deleted) {
					return
				}

				const removedNode: ArbitraryFolder = findNode(state.tree, "path", action.payload.node.path)
				const parent = getParentNode(state.tree, removedNode)

				parent.children = parent.children.filter((child) => child.path !== removedNode.path)

				if (state.currentPath === removedNode.path) {
					state.currentPath = ""
				}

				state.tree = sortTree(state.tree)
			},
		)

		builder.addCase(moveFileOrFolder.fulfilled, (state, action) => {
			const parent = getParentNode(state.tree, action.payload.node)
			const node: ArbitraryFolder | ArbitraryFile = findNode(
				state.tree,
				"path",
				action.payload.node.path,
			)
			parent.children = parent.children.filter((child) => child.path !== action.payload.node.path)

			const fullPath = action.payload.newPath.endsWith("/")
				? action.payload.newPath.slice(0, -1)
				: action.payload.newPath

			const relativePath = fullPath.replace(state.tree.path, "")

			const pathChunks = relativePath.split("/").slice(1, -1)

			let currentNode: ArbitraryFolder | ArbitraryFile = state.tree

			if (pathChunks.length > 0) {
				let i = 0

				while (i < pathChunks.length) {
					const newPath: string = currentNode.path.endsWith("/")
						? currentNode.path.concat(pathChunks[i])
						: currentNode.path.concat("/").concat(pathChunks[i])

					if (isFolder(currentNode)) {
						let found: ArbitraryFile | ArbitraryFolder = currentNode.children.find(
							(child) => child.path === newPath,
						)

						if (!found) {
							found = createArbitraryFolder(
								newPath,
								{ isDirectory: () => true } as any,
								currentNode,
							)
							currentNode.children.push(found)
						}

						currentNode = found
					}

					i++
				}
			}

			node.path = action.payload.newPath

			node.readableName = node.path.split("/").reverse()[0].split(".")[0]

			currentNode.children.push(node)

			state.tree = sortTree(state.tree)
		})
	},
})

export const { setRootPath, setCurrentPath } = fileTreeSlice.actions

export default fileTreeSlice.reducer
