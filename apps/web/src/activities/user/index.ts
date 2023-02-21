import { createActivityExtension } from "@ordo-pink/extensions"
import { OpenAccountCommand } from "./commands/open-account"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createActivityExtension("user", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
  readableName: "@ordo-activity-user/title",
  routes: ["/user"],
  commands: [OpenAccountCommand],
  translations: { en, ru },
})
