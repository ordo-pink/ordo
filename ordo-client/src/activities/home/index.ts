import { GoHomeCommand } from "$activities/home/commands/go-home"
import en from "$activities/home/translations/en.json"
import ru from "$activities/home/translations/ru.json"

import { createActivityExtension } from "$core/extensions/create-activity-extension"

export default createActivityExtension("home", {
  Component: () => import("$activities/home/components"),
  Icon: () => import("$activities/home/components/icon"),
  readableName: "@ordo-activity-home/title",
  routes: ["/home"],
  commands: [GoHomeCommand],
  translations: { en, ru },
})
