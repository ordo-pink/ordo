import { createBrowserRouter } from "react-router-dom"
import Welcome from "$activities/welcome"
import App from "$containers/app"

export const router = createBrowserRouter([
  {
    path: "*",
    element: <App />,
    children: [
      {
        path: "*",
        element: <Welcome />,
      },
    ],
  },
])
