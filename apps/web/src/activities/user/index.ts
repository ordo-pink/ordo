import { OpenAccountCommand } from "./commands/open-account"
import en from "./translations/en.json"
import ru from "./translations/ru.json"
import { createActivityExtension } from "../../core/extensions/create-activity-extension"

export default createActivityExtension("user", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
  readableName: "@ordo-activity-user/title",
  routes: ["/user"],
  commands: [OpenAccountCommand],
  translations: { en, ru },
})
