import type { OrdoFolder } from "../../../global-context/types"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type UiState = {
	showExplorer: boolean
	showSearcher: boolean
	showCreator: boolean
	createIn: OrdoFolder
}

const initialState: UiState = {
	showExplorer: true,
	showSearcher: false,
	showCreator: false,
	createIn: null,
}

const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		toggleCreator: (state, action?: PayloadAction<OrdoFolder>) => {
			state.showCreator = !state.showCreator
			state.createIn = action.payload
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
		setCreateIn: (state, action: PayloadAction<OrdoFolder>) => {
			state.createIn = action.payload
		},
	},
})

export const { hideExplorer, toggleCreator, toggleExplorer, toggleSearcher, setCreateIn } =
	uiSlice.actions

export default uiSlice.reducer
