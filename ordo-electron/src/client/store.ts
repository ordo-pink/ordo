import { configureStore } from "@reduxjs/toolkit"

import app from "@client/app/store"
import activityBar from "@client/activity-bar/store"
import createModal from "@client/create-modal/store"
import renameModal from "@client/rename-modal/store"
import commandPalette from "@client/command-palette/store"

export const reducer = {
  app,
  activityBar,
  createModal,
  renameModal,
  commandPalette,
}

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  reducer,
})

export type RootState<WithT = unknown> = ReturnType<typeof store.getState> & WithT
export type AppDispatch = typeof store.dispatch
