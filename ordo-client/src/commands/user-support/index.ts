import { OpenUserSupport } from "$commands/user-support/commands/open-user-support"
import { slice } from "$commands/user-support/store"
import en from "$commands/user-support/translations/en.json"
import ru from "$commands/user-support/translations/ru.json"

import { createCommandExtension } from "$core/extensions/create-command-extension"

export default createCommandExtension("user-support", {
  translations: { en, ru },
  commands: [OpenUserSupport],
  overlayComponents: [() => import("$commands/user-support/components/user-support-modal")],
  storeSlice: slice,
  readableName: "@ordo-command-user-support/readable-name",
})
