import { createCommandExtension } from "@ordo-pink/extensions"
import { ChangeDirectoryColorCommand } from "./commands/change-directory-color"
import { slice } from "./store"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createCommandExtension("colors", {
  readableName: "@ordo-command-colors/readable-name",
  description: "@ordo-command-colors/description",
  translations: { en, ru },
  storeSlice: slice,
  commands: [ChangeDirectoryColorCommand],
  overlayComponents: [() => import("./components/change-directory-color-modal")],
})
