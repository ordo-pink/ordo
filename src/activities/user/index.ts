import { openAccountCommand } from "$activities/user/commands/open-account"
import en from "$activities/user/translations/en.json"
import ru from "$activities/user/translations/ru.json"

import { createActivityExtension } from "$core/extensions/create-activity-extension"

export default createActivityExtension("user", {
  Component: () => import("$activities/user/components"),
  Icon: () => import("$activities/user/components/icon"),
  readableName: "@ordo-activity-user/title",
  routes: ["/user"],
  commands: [openAccountCommand],
  translations: { ru, en },
})
