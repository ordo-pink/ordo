import type { OrdoCommandExtension } from "@core/types"

import { ExtensionContextMenuLocation } from "@core/constants"

const RevealInFilesCommandExtension: OrdoCommandExtension<"reveal-in-files"> = {
  name: "ordo-command-reveal-in-files",
  translations: {
    en: { "@reveal-in-files/open-in-file-explorer": "Reveal in Files" },
    ru: { "@reveal-in-files/open-in-file-explorer": "Показать в проводнике" },
  },
  commands: [
    {
      title: "@reveal-in-files/open-in-file-explorer",
      icon: "BsFolderCheck",
      showInContextMenu: ExtensionContextMenuLocation.FILE_OR_FOLDER,
      action: (state, { target }) => {
        if (!target && !state.app.currentFile) return

        const type = "@reveal-in-files/open-in-file-explorer"
        const payload = target ? target.path : state.app.currentFile?.path

        if (!payload) return

        window.ordo.emit({ type, payload })
      },
    },
  ],
}

export default RevealInFilesCommandExtension
