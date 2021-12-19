import { configureStore } from "@reduxjs/toolkit";

import statusBarReducer from "../status-bar/state";

export const store = configureStore({
	reducer: {
		statusBar: statusBarReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
