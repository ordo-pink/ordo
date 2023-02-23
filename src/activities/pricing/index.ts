import { GoToPricingCommand } from "$activities/pricing/commands/go-to-pricing"
import en from "$activities/pricing/translations/en.json"
import ru from "$activities/pricing/translations/ru.json"

import { createActivityExtension } from "$core/extensions/create-activity-extension"

export default createActivityExtension("pricing", {
  Component: () => import("$activities/pricing/components"),
  Icon: () => import("$activities/pricing/components/icon"),
  readableName: "@ordo-activity-pricing/title",
  routes: ["/pricing"],
  commands: [GoToPricingCommand],
  translations: { en, ru },
})
