import type { OrdoCommandExtension } from "@core/types"

import { ExtensionContextMenuLocation } from "@core/constants"

const CopyPathCommandExtension: OrdoCommandExtension<"copy-path"> = {
  name: "ordo-command-copy-path",
  translations: {
    en: { "@copy-path/copy-relative-path": "Copy relative path" },
    ru: { "@copy-path/copy-relative-path": "Скопировать относительный путь" },
  },
  commands: [
    {
      title: "@copy-path/copy-relative-path",
      icon: "BsSignpost",
      showInContextMenu: ExtensionContextMenuLocation.FILE_OR_FOLDER,
      action: (state, { target }) => {
        if (!target && !state.app.currentFile) return

        const relativePath = target ? target.relativePath : state.app.currentFile?.relativePath

        if (!relativePath) return

        window.navigator.clipboard.writeText(relativePath)
      },
    },
  ],
}

export default CopyPathCommandExtension
