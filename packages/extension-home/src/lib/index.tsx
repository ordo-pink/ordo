import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createExtension("home", ({ registerTranslations, commands, registerActivity }) => {
  registerTranslations({ ru, en })

  registerActivity("landing-page", {
    routes: ["/"],
    Component: lazy(() => import("./components/home-component")),
    Icon: lazy(() => import("./components/home-icon")),
    show: false,
  })

  commands.on("go-home", () => commands.emit("navigate", "/"))
})
