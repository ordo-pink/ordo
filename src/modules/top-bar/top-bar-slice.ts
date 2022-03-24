import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TopBarState = {
	focused: boolean;
	value: string;
	items: string[];
};

export const initialState: TopBarState = {
	focused: false,
	value: "",
	items: [],
};

export const topBarSlice = createSlice({
	name: "top-bar",
	initialState,
	reducers: {
		unfocusTopBar: (state) => {
			state.focused = false;
		},
		toggleTopBarFocus: (state) => {
			state.focused = !state.focused;
		},
		setTopBarValue: (state, action: PayloadAction<string>) => {
			state.value = action.payload;
		},
		openCommandPalette: (state) => {
			state.focused = true;
			state.value = ">";
		},
		openSearchInFile: (state) => {
			state.focused = true;
			state.value = "";
		},
		openGoToLine: (state) => {
			state.focused = true;
			state.value = ":";
		},
	},
});

export const { openSearchInFile, openGoToLine, unfocusTopBar, toggleTopBarFocus, setTopBarValue, openCommandPalette } =
	topBarSlice.actions;

export const topBarReducer = topBarSlice.reducer;
