import { configureStore } from "@reduxjs/toolkit"

import contextMenu from "$containers/app/hooks/use-context-menu/store"
import deleteModal from "$containers/app/hooks/use-delete-modal/store"
import app from "$containers/app/store"

export const reducer = {
  app,
  contextMenu,
  deleteModal,
}

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  reducer,
})
