import { createActivityExtension } from "@ordo-pink/extensions"
import { GoToPricingCommand } from "./commands/go-to-pricing"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createActivityExtension("pricing", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
  readableName: "@ordo-activity-pricing/title",
  routes: ["/pricing"],
  commands: [GoToPricingCommand],
  translations: { en, ru },
})
