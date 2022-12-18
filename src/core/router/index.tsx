import { createBrowserRouter } from "react-router-dom"

import App from "$containers/app"
import Welcome from "$core/components/welcome"

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
