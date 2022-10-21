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
      accelerator: "ctrl+alt+c",
      showInCommandPalette: true,
      showInContextMenu: ExtensionContextMenuLocation.FILE_OR_DIRECTORY_OR_ROOT,
      action: (_, { contextMenuTarget, currentFile }) => {
        if (!contextMenuTarget && !currentFile) return

        const relativePath = contextMenuTarget
          ? contextMenuTarget.relativePath
          : currentFile?.relativePath

        if (!relativePath) return

        window.navigator.clipboard.writeText(relativePath)
      },
    },
    {
      title: "@copy-path/copy-path",
      icon: "BsSignpost2",
      accelerator: "ctrl+alt+shift+c",
      showInCommandPalette: true,
      showInContextMenu: ExtensionContextMenuLocation.FILE_OR_DIRECTORY_OR_ROOT,
      action: (state, { contextMenuTarget, currentFile }) => {
        const path = contextMenuTarget
          ? contextMenuTarget.path
          : currentFile
          ? currentFile.path
          : state.app.userSettings["project.personal.directory"]

        if (!path) return

        window.navigator.clipboard.writeText(path)
      },
    },
  ],
}

export default CopyPathCommandExtension
