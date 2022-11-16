import { Suspense } from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { RouterProvider } from "react-router-dom"

import Welcome from "$activities/welcome"
import { router } from "$core/router"
import { store } from "$core/state"

import "$assets/index.css"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement)

root.render(
  <Provider store={store}>
    <Suspense fallback={<Welcome />}>
      <RouterProvider router={router} />
    </Suspense>
  </Provider>,
)
