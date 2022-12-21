import { configureStore } from "@reduxjs/toolkit"

import createModal from "$containers/app/components/create-modal/store"
import app from "$containers/app/store"

export const reducer = {
  app,
  createModal,
}

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  reducer,
})
