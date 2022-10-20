import { OrdoCommandExtension } from "@core/types"

import CopyPathCommandExtension from "@extensions/commands/copy-path"
import RevealInFilesCommandExtension from "@extensions/commands/reveal-in-files"
import DuplicateCommandExtension from "@extensions/commands/duplicate"
import CreateCommandExtension from "@extensions/commands/create"

// TODO: Replace this with actual extension installation (when ready)
export const Extensions: OrdoCommandExtension<string>[] = [
  CreateCommandExtension,
  CopyPathCommandExtension,
  DuplicateCommandExtension,
]

const userAgent = navigator.userAgent.toLowerCase()
const isElectron = userAgent.indexOf(" electron/") > -1

if (isElectron) {
  Extensions.push(RevealInFilesCommandExtension)
}
