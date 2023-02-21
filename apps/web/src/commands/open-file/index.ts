import { createCommandExtension } from "@ordo-pink/extensions"
import OpenOpenFile from "./commands/open-open-file"
import { slice } from "./store"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createCommandExtension("open-file", {
  commands: [OpenOpenFile],
  overlayComponents: [() => import("./components/modal")],
  translations: { en, ru },
  readableName: "@ordo-command-open-file/readable-name",
  storeSlice: slice,
  description: "@ordo-command-open-file/description",
})
