import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SidebarState = {
	show: boolean;
	width: number;
};

export const initialState: SidebarState = {
	show: false,
	width: 20,
};

export const sidebarSlice = createSlice({
	name: "sidebar",
	initialState,
	reducers: {
		setSidebarWidth: (state, action: PayloadAction<number>) => {
			state.width = action.payload;
			state.show = action.payload > 1;
		},
		toggleSidebar: (state) => {
			state.show = !state.show;

			if (state.show && state.width <= 100) {
				state.width = window.innerWidth * 0.02;
			}
		},
		showSidebar: (state) => {
			state.show = true;

			if (state.width <= 100) {
				state.width = window.innerWidth * 0.02;
			}
		},
		hideSidebar: (state) => {
			state.show = false;
		},
	},
});

export const { setSidebarWidth, toggleSidebar, showSidebar, hideSidebar } = sidebarSlice.actions;

export const sidebarReducer = sidebarSlice.reducer;
