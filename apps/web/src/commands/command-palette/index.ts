import { createCommandExtension } from "@ordo-pink/extensions"
import OpenCommandPalette from "./commands/open-command-palette"
import { slice } from "./store"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createCommandExtension("command-palette", {
  commands: [OpenCommandPalette],
  overlayComponents: [() => import("./components/modal")],
  translations: { en, ru },
  readableName: "@ordo-command-command-palette/readable-name",
  storeSlice: slice,
  description: "@ordo-command-command-palette/description",
})
