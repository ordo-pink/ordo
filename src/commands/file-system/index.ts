import { CreateDirectoryCommand } from "$commands/file-system/commands/create-directory"
import { CreateFileCommand } from "$commands/file-system/commands/create-file"
import { DeleteDirectoryCommand } from "$commands/file-system/commands/delete-directory"
import { DeleteFileCommand } from "$commands/file-system/commands/delete-file"
import { slice } from "$commands/file-system/store"
import en from "$commands/file-system/translations/en.json"
import ru from "$commands/file-system/translations/ru.json"

import { createCommandExtension } from "$core/extensions/create-command-extension"

export default createCommandExtension("file-system", {
  readableName: "@ordo-command-file-system/readable-name",
  description: "@ordo-command-file-system/description",
  translations: { ru, en },
  storeSlice: slice,
  commands: [CreateFileCommand, CreateDirectoryCommand, DeleteFileCommand, DeleteDirectoryCommand],
  overlayComponents: [
    () => import("$commands/file-system/components/delete-modal"),
    () => import("$commands/file-system/components/create-modal"),
  ],
})
