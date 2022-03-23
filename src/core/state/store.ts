import { sidebarReducer, SidebarState } from "@containers/sidebar/sidebar-slice";
import { activityBarReducer, ActivityBarState } from "@modules/activity-bar/activity-bar-slice";
import { configureStore } from "@reduxjs/toolkit";
import { applyPatches as apply, enablePatches } from "immer";

enablePatches();

export type State = {
	activityBar: ActivityBarState;
	sidebar: SidebarState;
};

export const store = configureStore({
	reducer: {
		activityBar: activityBarReducer,
		sidebar: sidebarReducer,
	},
	middleware: (d) => d({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
