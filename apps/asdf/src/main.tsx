import { lazy } from "react"
import { createRoot } from "react-dom/client"

export default function () {
  return {
    init: () => ({
      activities: [
        {
          name: "landing-page",
          routes: ["/"],
          render: ({ container }: any) => {
            const root = createRoot(container)
            const App = lazy(() => import("./app/app"))

            root.render(<App />)
          },
          renderIcon: ({ container }: any) => {
            container.innerHTML = "A"
          },
        },
      ],
    }),
  }
}
