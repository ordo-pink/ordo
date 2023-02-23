import { ColourTheme, Language } from "@ordo-pink/core"
import en from "$activities/calendar/translations/en.json"
import ru from "$activities/calendar/translations/ru.json"

import { createActivityExtension } from "$core/extensions/create-activity-extension"

export default createActivityExtension("calendar", {
  Component: () => import("$activities/calendar/components"),
  Icon: () => import("$activities/calendar/components/icon"),
  routes: ["/calendar", "/calendar/:extension"],
  readableName: "@ordo-activity-calendar/title",
  translations: { en, ru },
  metadata: { language: Language.ENGLISH, theme: ColourTheme.SYSTEM },
})
