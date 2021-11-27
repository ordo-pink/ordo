import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { ArbitraryFolder } from "../../../global-context/types"

export const fetchFileTree = createAsyncThunk("fileTree/init", (rootPath: string) =>
	window.fileSystemAPI.listFolder(rootPath),
)

export type FileTreeState = {
	status: "pending" | "fulfilled" | "rejected"
	tree: ArbitraryFolder | null
	errorMessage: string
}

const initialState: FileTreeState = {
	status: "pending",
	tree: null,
	errorMessage: "",
}

const fileTreeSlice = createSlice({
	name: "fileTree",
	initialState,
	reducers: {
		// incremented(state) {
		// 	state.
		// },
		// amountAdded(state, action: PayloadAction<number>) {
		// 	state.value += action.payload
		// },
	},
	extraReducers: (builder) => {
		builder.addCase(fetchFileTree.fulfilled, (state, action) => {
			state.status = "fulfilled"
			state.tree = action.payload
			state.errorMessage = ""
		})

		builder.addCase(fetchFileTree.rejected, (state) => {
			state.status = "rejected"
			state.errorMessage = "Could not open the root folder"
		})

		builder.addCase(fetchFileTree.pending, (state) => {
			state.status = "pending"
		})
	},
})

// export const { incremented, amountAdded } = fileTreeSlice.actions

export default fileTreeSlice.reducer
