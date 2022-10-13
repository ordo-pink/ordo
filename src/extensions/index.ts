import { OrdoCommandExtension } from "@core/types"

import CopyPathCommandExtension from "@extensions/copy-path"
import RevealInFilesCommandExtension from "@extensions/reveal-in-files"
import DuplicateCommandExtension from "@extensions/duplicate"

// TODO: Replace this with extension installation
export const Extensions: OrdoCommandExtension<string>[] = [
  CopyPathCommandExtension,
  DuplicateCommandExtension,
]

const userAgent = navigator.userAgent.toLowerCase()
const isElectron = userAgent.indexOf(" electron/") > -1

if (isElectron) {
  Extensions.push(RevealInFilesCommandExtension)
}
