import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

const Icon = lazy(() => import("./components/icon"))
const Component = lazy(() => import("./components"))

const homeActivity = { routes: ["/"], Component, Icon }

export default createExtension(
  "home",
  ({ registerTranslations, registerCommand, executeCommand }) => {
    registerTranslations({ ru, en })

    registerCommand("go-home", () => executeCommand("navigate", "/"))

    return { activities: [homeActivity] }
  },
)
