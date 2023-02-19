import { GoToPricingCommand } from "./commands/go-to-pricing"
import en from "./translations/en.json"
import ru from "./translations/ru.json"
import { createActivityExtension } from "../../core/extensions/create-activity-extension"

export default createActivityExtension("pricing", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
  readableName: "@ordo-activity-pricing/title",
  routes: ["/pricing"],
  commands: [GoToPricingCommand],
  translations: { en, ru },
})
