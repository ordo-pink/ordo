import { configureStore } from "@reduxjs/toolkit";
import { applyPatches as apply, enablePatches } from "immer";

import { panelReducer, PanelState } from "@containers/panel/panel-slice";
import { sidebarReducer, SidebarState } from "@containers/sidebar/sidebar-slice";
import { activityBarReducer, ActivityBarState } from "@modules/activity-bar/activity-bar-slice";
import { statusBarReducer, StatusBarState } from "@containers/status-bar/status-bar-slice";
import { topBarReducer, TopBarState } from "@modules/top-bar/top-bar-slice";
import { editorReducer, EditorState } from "@modules/editor/editor-slice";
import { fileExplorerReducer, FileExplorerState } from "@modules/file-explorer/file-explorer-slice";

enablePatches();

export type State = {
	activityBar: ActivityBarState;
	sidebar: SidebarState;
	panel: PanelState;
	statusBar: StatusBarState;
	topBar: TopBarState;
	editor: EditorState;
	fileExplorer: FileExplorerState;
};

export const store = configureStore({
	reducer: {
		activityBar: activityBarReducer,
		sidebar: sidebarReducer,
		panel: panelReducer,
		statusBar: statusBarReducer,
		topBar: topBarReducer,
		editor: editorReducer,
		fileExplorer: fileExplorerReducer,
	},
	middleware: (d) => d({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
