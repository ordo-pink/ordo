import type { OrdoCommandExtension } from "@core/types"

import { ExtensionContextMenuLocation } from "@core/constants"

const CopyPathCommandExtension: OrdoCommandExtension<"copy-path"> = {
  name: "ordo-command-copy-path",
  translations: {
    en: {
      "@copy-path/copy-relative-path": "Copy relative path",
      "@copy-path/copy-path": "Copy path",
    },
    ru: {
      "@copy-path/copy-relative-path": "Скопировать относительный путь",
      "@copy-path/copy-path": "Скопировать путь",
    },
  },
  commands: [
    {
      title: "@copy-path/copy-relative-path",
      icon: "BsSignpost",
      showInContextMenu: ExtensionContextMenuLocation.FILE_OR_DIRECTORY,
      showInCommandPalette: true,
      action: (state, { target }) => {
        if (!target && !state.app.currentFile) return

        const relativePath = target ? target.relativePath : state.app.currentFile?.relativePath

        if (!relativePath) return

        window.navigator.clipboard.writeText(relativePath)
      },
    },
    {
      title: "@copy-path/copy-path",
      icon: "BsSignpost2",
      showInContextMenu: ExtensionContextMenuLocation.FILE_OR_DIRECTORY,
      showInCommandPalette: true,
      action: (state, { target }) => {
        const path = target
          ? target.path
          : state.app.currentFile
          ? state.app.currentFile.path
          : state.app.userSettings["project.personal.directory"]

        if (!path) return

        window.navigator.clipboard.writeText(path)
      },
    },
  ],
}

export default CopyPathCommandExtension
