import { configureStore } from "@reduxjs/toolkit"

import createModal from "$containers/app/components/create-modal/store"
import contextMenu from "$containers/app/hooks/use-context-menu/store"
import app from "$containers/app/store"

export const reducer = {
  app,
  contextMenu,
  createModal,
}

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  reducer,
})
