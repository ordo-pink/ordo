import { createActivityExtension } from "@ordo-pink/extensions"
import { GoHomeCommand } from "./commands/go-home"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createActivityExtension("home", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
  readableName: "@ordo-activity-home/title",
  routes: ["/home"],
  commands: [GoHomeCommand],
  translations: { en, ru },
})
