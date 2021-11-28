import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type UiState = {
	showExplorer: boolean
	showSearcher: boolean
	showCreator: boolean
	creatorPath: string
}

const initialState: UiState = {
	showExplorer: true,
	showSearcher: false,
	showCreator: false,
	creatorPath: "",
}

const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		toggleCreator: (state, action: PayloadAction<string>) => {
			state.showCreator = !state.showCreator
			state.creatorPath = action.payload
		},
		toggleExplorer: (state) => {
			state.showExplorer = !state.showExplorer
		},
		hideExplorer: (state) => {
			state.showExplorer = false
		},
		toggleSearcher: (state) => {
			state.showSearcher = !state.showSearcher
		},
	},
})

export const { hideExplorer, toggleCreator, toggleExplorer, toggleSearcher } = uiSlice.actions

export default uiSlice.reducer
