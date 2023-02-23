import { GoToFeaturesCommand } from "$activities/features/commands/go-to-features"
import en from "$activities/features/translations/en.json"
import ru from "$activities/features/translations/ru.json"

import { createActivityExtension } from "$core/extensions/create-activity-extension"

export default createActivityExtension("features", {
  Component: () => import("$activities/features/components"),
  Icon: () => import("$activities/features/components/icon"),
  routes: ["/features", "/features/:feature"],
  readableName: "@ordo-activity-features/title",
  commands: [GoToFeaturesCommand],
  translations: { en, ru },
})
