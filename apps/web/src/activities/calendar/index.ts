import { createActivityExtension } from "@ordo-pink/extensions"
import { OpenCalendarCommand } from "./commands/open-calendar"

import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createActivityExtension("calendar", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
  commands: [OpenCalendarCommand],
  routes: ["/calendar", "/calendar/:view"],
  readableName: "@ordo-activity-calendar/title",
  translations: { en, ru },
})
