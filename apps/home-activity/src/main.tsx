import { createExtension } from "@ordo-pink/extensions"
import { lazy } from "react"
import { createRoot } from "react-dom/client"
import en from "./home/translations/en.json"
import ru from "./home/translations/ru.json"

import "./styles.css"

export const extension = createExtension(
  "ordo-home",
  ({ registerCommand, navigate, registerTranslations }) => {
    registerTranslations({ ru })
    registerTranslations({ en })

    console.log("HERE")

    registerCommand("ordo-home.go-home", () => navigate("/"))

    return {
      init: () => ({
        activities: [
          {
            name: "landing-page",
            routes: ["/"],
            render: ({ container }) => {
              const root = createRoot(container)
              const App = lazy(() => import("./home/components"))

              root.render(<App />)
            },
            renderIcon: ({ container }) => {
              const root = createRoot(container)
              const Icon = lazy(() => import("./home/components/icon"))

              root.render(<Icon />)
            },
          },
        ],
      }),
    }
  },
)
