import { OrdoCommandExtension } from "@core/types"

import CopyPathCommandExtension from "@extensions/commands/copy-path"
import RevealInFilesCommandExtension from "@extensions/commands/reveal-in-files"
import DuplicateCommandExtension from "@extensions/commands/duplicate"
import MdToIsmCommandExtension from "@extensions/commands/md-to-ism"
import TagsActivityExtension from "@extensions/activities/tags"
import CheckboxesActivityExtension from "@extensions/activities/checkboxes"

// TODO: Replace this with actual extension installation (when ready)
const extensions: OrdoCommandExtension<string>[] = [
  CopyPathCommandExtension,
  DuplicateCommandExtension,
  RevealInFilesCommandExtension,
  MdToIsmCommandExtension,
  TagsActivityExtension,
  CheckboxesActivityExtension,
]

export const Extensions: OrdoCommandExtension<string>[] = []

const userAgent = navigator.userAgent.toLowerCase()
const isElectron = userAgent.indexOf(" electron/") > -1

extensions.forEach((extension) => {
  // TODO: Remove dependency on electron handlers, they should simply be ignored
  const hasElectronHandlers = extension.commands.some((command) => !command.hasElectronHanlders)

  if (!hasElectronHandlers || isElectron) Extensions.push(extension)
})
