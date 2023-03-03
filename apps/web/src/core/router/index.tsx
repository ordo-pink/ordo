import { Loading } from "@ordo-pink/react-utils"
import { createBrowserRouter } from "react-router-dom"
import App from "../../containers/app"

export const router = createBrowserRouter([
  {
    path: "*",
    element: <App />,
    children: [
      {
        path: "*",
        element: <Loading />,
      },
    ],
  },
])
