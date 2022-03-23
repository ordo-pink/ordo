import { SupportedIcon } from "@core/apprearance/icons";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ActivityBarItem = {
	show: boolean;
	name: string;
	icon: SupportedIcon;
};

export type ActivityBarState = {
	current: string;
	items: ActivityBarItem[];
};

export const initialState: ActivityBarState = {
	current: "Welcome",
	items: [
		{ show: true, name: "Editor", icon: "HiOutlineDocumentText" },
		{ show: true, name: "Graph", icon: "HiOutlineShare" },
		{ show: false, name: "Welcome", icon: "HiOutlineInbox" },
		{ show: false, name: "Achievements", icon: "HiOutlineSparkles" },
		{ show: false, name: "Settings", icon: "HiOutlineCog" },
	],
};

export const activityBarSlice = createSlice({
	name: "activity-bar",
	initialState,
	reducers: {
		selectActivity: (state, action: PayloadAction<string>) => {
			state.current = action.payload;
		},
	},
});

export const { selectActivity } = activityBarSlice.actions;

export const activityBarReducer = activityBarSlice.reducer;
