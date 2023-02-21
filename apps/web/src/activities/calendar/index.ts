import { ColourTheme } from "@ordo-pink/common-types"
import { TwoLetterLocale } from "@ordo-pink/locale"

import en from "./translations/en.json"
import ru from "./translations/ru.json"

import { createActivityExtension } from "../../core/extensions/create-activity-extension"

export default createActivityExtension("calendar", {
  Component: () => import("../calendar/components"),
  Icon: () => import("../calendar/components/icon"),
  routes: ["/calendar", "/calendar/:extension"],
  readableName: "@ordo-activity-calendar/title",
  translations: { en, ru },
  persistedState: { language: TwoLetterLocale.ENGLISH, theme: ColourTheme.SYSTEM },
})
