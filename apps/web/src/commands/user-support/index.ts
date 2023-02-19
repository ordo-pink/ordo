import { OpenUserSupport } from "./commands/open-user-support"
import { slice } from "./store"
import en from "./translations/en.json"
import ru from "./translations/ru.json"
import { createCommandExtension } from "../../core/extensions/create-command-extension"

export default createCommandExtension("user-support", {
  translations: { en, ru },
  commands: [OpenUserSupport],
  overlayComponents: [() => import("./components/user-support-modal")],
  storeSlice: slice,
  readableName: "@ordo-command-user-support/readable-name",
})
