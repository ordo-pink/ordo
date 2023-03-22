import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

const Icon = lazy(() => import("./components/home-icon"))
const Component = lazy(() => import("./components/home-component"))

const homeActivity = { routes: ["/"], Component, Icon, name: "home.landing-page" }

export default createExtension(
  "home",
  ({ registerTranslations, registerCommand, executeCommand, registerActivity }) => {
    registerTranslations({ ru, en })

    registerActivity(homeActivity)

    registerCommand("go-home", () => executeCommand("navigate", "/"))
  },
)
