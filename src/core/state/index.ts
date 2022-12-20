import { configureStore } from "@reduxjs/toolkit"

import app from "$containers/app/store"
import createModal from "$containers/app/components/create-modal/store"

export const reducer = {
  app,
  createModal,
}

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  reducer,
})
