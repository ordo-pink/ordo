import { configureStore } from "@reduxjs/toolkit"

import contextMenu from "../../containers/app/hooks/use-context-menu/store"
import app from "../../containers/app/store"

export const reducer = {
  app,
  contextMenu,
}

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  reducer,
})
