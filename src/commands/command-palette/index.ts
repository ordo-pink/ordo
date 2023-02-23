import OpenCommandPalette from "$commands/command-palette/commands/open-command-palette"
import { slice } from "$commands/command-palette/store"
import en from "$commands/command-palette/translations/en.json"
import ru from "$commands/command-palette/translations/ru.json"

import { createCommandExtension } from "$core/extensions/create-command-extension"

export default createCommandExtension("command-palette", {
  commands: [OpenCommandPalette],
  overlayComponents: [() => import("$commands/command-palette/components/modal")],
  translations: { en, ru },
  readableName: "@ordo-command-command-palette/readable-name",
  storeSlice: slice,
  description: "@ordo-command-command-palette/description",
})
