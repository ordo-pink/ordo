import { configureStore } from "@reduxjs/toolkit"

import app from "$containers/app/store"

export const reducer = {
  app,
}

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  reducer,
})
