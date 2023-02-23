import OpenOpenFile from "$commands/open-file/commands/open-open-file"
import { slice } from "$commands/open-file/store"
import en from "$commands/open-file/translations/en.json"
import ru from "$commands/open-file/translations/ru.json"

import { createCommandExtension } from "$core/extensions/create-command-extension"

export default createCommandExtension("open-file", {
  commands: [OpenOpenFile],
  overlayComponents: [() => import("$commands/open-file/components/modal")],
  translations: { en, ru },
  readableName: "@ordo-command-open-file/readable-name",
  storeSlice: slice,
  description: "@ordo-command-open-file/description",
})
