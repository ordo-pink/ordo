import { configureStore } from "@reduxjs/toolkit"

import createModal from "$containers/app/components/create-modal/store"
import app from "$containers/app/store"
import contextMenu from "$core/hooks/use-context-menu/store"

export const reducer = {
  app,
  contextMenu,
  createModal,
}

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  reducer,
})
