import en from "$activities/extension-store/translations/en.json"
import ru from "$activities/extension-store/translations/ru.json"

import { createActivityExtension } from "$core/extensions/create-activity-extension"

export default createActivityExtension("extension-store", {
  Component: () => import("$activities/extension-store/components"),
  Icon: () => import("$activities/extension-store/components/icon"),
  readableName: "@ordo-activity-extension-store/title",
  routes: ["/extension-store", "/extension-store/:type/:name"],
  translations: { en, ru },
})
