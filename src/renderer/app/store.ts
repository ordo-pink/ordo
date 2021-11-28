import { configureStore } from "@reduxjs/toolkit"
import fileTreeReducer from "../features/file-tree/file-tree-slice"
import uiReducer from "../features/ui/ui-slice"

export const store = configureStore({
	reducer: { fileTree: fileTreeReducer, ui: uiReducer },
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
