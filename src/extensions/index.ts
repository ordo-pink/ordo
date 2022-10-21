import { OrdoCommandExtension } from "@core/types"

import CopyPathCommandExtension from "@extensions/commands/copy-path"
import RevealInFilesCommandExtension from "@extensions/commands/reveal-in-files"
import DuplicateCommandExtension from "@extensions/commands/duplicate"
import CreateCommandExtension from "@extensions/commands/create"
import RenameCommandExtension from "@extensions/commands/rename"

// TODO: Replace this with actual extension installation (when ready)
const extensions: OrdoCommandExtension<string>[] = [
  CreateCommandExtension,
  RenameCommandExtension,
  CopyPathCommandExtension,
  DuplicateCommandExtension,
  RevealInFilesCommandExtension,
]

export const Extensions: OrdoCommandExtension<string>[] = []

const userAgent = navigator.userAgent.toLowerCase()
const isElectron = userAgent.indexOf(" electron/") > -1

extensions.forEach((extension) => {
  const hasElectronHandlers = extension.commands.some((command) => !command.hasElectronHanlders)

  if (!hasElectronHandlers || isElectron) Extensions.push(extension)
})
