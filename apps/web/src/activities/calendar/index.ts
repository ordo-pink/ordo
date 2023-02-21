import { ColourTheme } from "@ordo-pink/common-types"
import { createActivityExtension } from "@ordo-pink/extensions"
import { TwoLetterLocale } from "@ordo-pink/locale"

import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createActivityExtension("calendar", {
  Component: () => import("../calendar/components"),
  Icon: () => import("../calendar/components/icon"),
  routes: ["/calendar", "/calendar/:extension"],
  readableName: "@ordo-activity-calendar/title",
  translations: { en, ru },
  persistedState: { language: TwoLetterLocale.ENGLISH, theme: ColourTheme.SYSTEM },
})
