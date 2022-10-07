import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"

import { store } from "@client/store"

import App from "@client/app"

import "@client/i18n/index"
import "@assets/index.css"

const container = document.getElementById("app") as HTMLDivElement
const root = createRoot(container)

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)
