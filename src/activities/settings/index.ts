import { ColourTheme, Language } from "@ordo-pink/core"
import en from "$activities/settings/translations/en.json"
import ru from "$activities/settings/translations/ru.json"

import { createActivityExtension } from "$core/extensions/create-activity-extension"

export default createActivityExtension("settings", {
  Component: () => import("$activities/settings/components"),
  Icon: () => import("$activities/settings/components/icon"),
  routes: ["/settings", "/settings/:extension"],
  readableName: "@ordo-activity-settings/title",
  translations: { en, ru },
  metadata: { language: Language.ENGLISH, theme: ColourTheme.SYSTEM },
})
