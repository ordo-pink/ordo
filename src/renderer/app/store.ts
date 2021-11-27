import { configureStore } from "@reduxjs/toolkit"
import fileTreeReducer from "../features/file-tree/file-tree-slice"

export const store = configureStore({
	reducer: { fileTree: fileTreeReducer },
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
