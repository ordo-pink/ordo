import { CreateDirectoryCommand } from "./commands/create-directory"
import { CreateFileCommand } from "./commands/create-file"
import { DeleteDirectoryCommand } from "./commands/delete-directory"
import { DeleteFileCommand } from "./commands/delete-file"
import { DownloadFileCommand } from "./commands/download-file"
import { slice } from "./store"
import en from "./translations/en.json"
import ru from "./translations/ru.json"
import { createCommandExtension } from "../../core/extensions/create-command-extension"

export default createCommandExtension("file-system", {
  readableName: "@ordo-command-file-system/readable-name",
  description: "@ordo-command-file-system/description",
  translations: { en, ru },
  storeSlice: slice,
  commands: [
    CreateFileCommand,
    CreateDirectoryCommand,
    DeleteFileCommand,
    DeleteDirectoryCommand,
    DownloadFileCommand,
  ],
  overlayComponents: [
    () => import("./components/delete-modal"),
    () => import("./components/create-modal"),
  ],
})
