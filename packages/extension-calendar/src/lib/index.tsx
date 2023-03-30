import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createExtension(
  "calendar",
  ({ commands, registerActivity, registerTranslations }) => {
    registerActivity("calendar", {
      routes: ["/calendar", "/calendar/:view"],
      Component: lazy(() => import("./components/index")),
      Icon: lazy(() => import("./components/icon")),
      Sidebar: lazy(() => import("./components/sidebar")),
    })

    registerTranslations({ ru, en })

    commands.on("open-calendar", () => {
      commands.emit("router.navigate", "/calendar")
    })
  },
)
