import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StatusBarItem {
	id: string;
	value?: string;
	position: "left" | "right";
	onClick?: () => void;
}

export type StatusBarState = {
	left: StatusBarItem[];
	right: StatusBarItem[];
};

const initialState = {
	left: [] as StatusBarItem[],
	right: [] as StatusBarItem[],
};

const statusBarSlice = createSlice({
	name: "status-bar",
	initialState,
	reducers: {
		addStatusBarItem: (state, action: PayloadAction<StatusBarItem>) => {
			if (
				state.left.find((item) => item.id === action.payload.id) ||
				state.right.find((item) => item.id === action.payload.id)
			) {
				return;
			}

			state[action.payload.position].push(action.payload);
		},
		updateStatusBarItem: (state, action: PayloadAction<StatusBarItem>) => {
			const index = state[action.payload.position].findIndex((item) => item.id === action.payload.id);

			if (!~index) {
				state[action.payload.position].push(action.payload);

				return;
			}

			state[action.payload.position].splice(index, 1, action.payload);
		},
		removeStatusBarItem: (state, action: PayloadAction<StatusBarItem>) => {
			const index = state[action.payload.position].findIndex((item) => item.id === action.payload.id);

			if (!~index) {
				state[action.payload.position].push(action.payload);

				return;
			}

			state[action.payload.position].splice(index, 1);
		},
	},
});

export const { addStatusBarItem, updateStatusBarItem, removeStatusBarItem } = statusBarSlice.actions;
export default statusBarSlice.reducer;
