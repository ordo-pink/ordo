import { configureStore } from "@reduxjs/toolkit"
// import { ThunkMiddleware } from "redux-thunk"
// import fileTreeReducer, { FileTreeState } from "../features/file-tree/file-tree-slice"
import fileTreeReducer from "../features/file-tree/file-tree-slice"
import uiReducer from "../features/ui/ui-slice"
// import uiReducer, { UiState } from "../features/ui/ui-slice"

// const mw: ThunkMiddleware<{ fileTree: FileTreeState; ui: UiState }> =
// 	(api) => (next) => (action) => {
// 		{
// TODO: Save state in one go to avoid indexing
// 			return next(action)
// 		}
// 	}

export const store = configureStore({
	reducer: { fileTree: fileTreeReducer, ui: uiReducer },
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
	// .concat(mw),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
