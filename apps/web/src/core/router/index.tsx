import { createBrowserRouter } from "react-router-dom"
import App from "../../containers/app"
import Loading from "../components/loading"

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
