import { configureStore } from "@reduxjs/toolkit";

import statusBarReducer from "../status-bar/state";
import explorerReducer from "../explorer/state";
import editorReducer from "../editor/state";

export const store = configureStore({
	reducer: {
		statusBar: statusBarReducer,
		explorer: explorerReducer,
		editor: editorReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
