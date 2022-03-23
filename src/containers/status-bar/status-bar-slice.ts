import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type StatusBarItem = {
	name: string;
	content: string;
};

export type StatusBarState = {
	items: StatusBarItem[];
};

export const initialState: StatusBarState = {
	items: [
		{
			name: "Editor Position",
			content: "Ln 12, Col 23",
		},
		{
			name: "Document Connections",
			content: "In 5, Out 1",
		},
	],
};

export const statusBarSlice = createSlice({
	name: "sidebar",
	initialState,
	reducers: {
		addStatusBarItem: (state, action: PayloadAction<StatusBarItem>) => {
			const item = state.items.find((item) => item.name === action.payload.name);

			if (!item) {
				state.items.push(action.payload);
			}
		},
		updateStatusBarItem: (state, action: PayloadAction<StatusBarItem>) => {
			const item = state.items.find((item) => item.name === action.payload.name);

			if (!item) {
				state.items.push(action.payload);
			} else {
				item.content = action.payload.content;
			}
		},
		deleteStatusBarItem: (state, action: PayloadAction<StatusBarItem>) => {
			state.items = state.items.filter((item) => item.name !== action.payload.name);
		},
		setStatusBarItems: (state, action: PayloadAction<StatusBarItem[]>) => {
			state.items = action.payload;
		},
		clearStatusBarItems: (state) => {
			state.items = [];
		},
	},
});

export const { addStatusBarItem, updateStatusBarItem, deleteStatusBarItem, setStatusBarItems, clearStatusBarItems } =
	statusBarSlice.actions;

export const statusBarReducer = statusBarSlice.reducer;
