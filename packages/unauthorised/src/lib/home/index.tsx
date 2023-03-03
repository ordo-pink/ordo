import { createExtension } from "@ordo-pink/extensions"
import { lazy } from "react"
import { createRoot } from "react-dom/client"
import en from "./lib/translations/en.json"
import ru from "./lib/translations/ru.json"

export default createExtension(
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
              const App = lazy(() => import("./lib/components"))

              root.render(<App />)
            },
            renderIcon: ({ container }) => {
              const root = createRoot(container)
              const Icon = lazy(() => import("./lib/components/icon"))

              root.render(<Icon />)
            },
          },
        ],
      }),
    }
  },
)
