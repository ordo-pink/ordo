import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PanelState = {
	show: boolean;
	height: number;
};

export const initialState: PanelState = {
	show: false,
	height: 20,
};

export const panelSlice = createSlice({
	name: "panel",
	initialState,
	reducers: {
		setPanelHeight: (state, action: PayloadAction<number>) => {
			state.height = action.payload;
			state.show = action.payload > 1;
		},
		togglePanel: (state) => {
			state.show = !state.show;
		},
		showPanel: (state) => {
			state.show = true;
		},
		hidePanel: (state) => {
			state.show = false;
		},
	},
});

export const { setPanelHeight, togglePanel, showPanel, hidePanel } = panelSlice.actions;

export const panelReducer = panelSlice.reducer;
