import { configureStore } from "@reduxjs/toolkit"

import app from "@client/app/store"
import tags from "@extensions/activities/tags/store"
import activityBar from "@client/activity-bar/store"
import createModal from "@client/create-modal/store"
import renameModal from "@client/rename-modal/store"
import commandPalette from "@client/command-palette/store"

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  reducer: {
    app,
    tags,
    activityBar,
    createModal,
    renameModal,
    commandPalette,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
