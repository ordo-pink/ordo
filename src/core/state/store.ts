import { configureStore } from "@reduxjs/toolkit";
import { applyPatches as apply, enablePatches } from "immer";

import { panelReducer, PanelState } from "@containers/panel/panel-slice";
import { sidebarReducer, SidebarState } from "@containers/sidebar/sidebar-slice";
import { activityBarReducer, ActivityBarState } from "@modules/activity-bar/activity-bar-slice";
import { statusBarReducer, StatusBarState } from "@containers/status-bar/status-bar-slice";

enablePatches();

export type State = {
	activityBar: ActivityBarState;
	sidebar: SidebarState;
	panel: PanelState;
	statusBar: StatusBarState;
};

export const store = configureStore({
	reducer: {
		activityBar: activityBarReducer,
		sidebar: sidebarReducer,
		panel: panelReducer,
		statusBar: statusBarReducer,
	},
	middleware: (d) => d({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
