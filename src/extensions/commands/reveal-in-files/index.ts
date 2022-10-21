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
      hasElectronHanlders: true,
      showInCommandPalette: true,
      showInContextMenu: ExtensionContextMenuLocation.FILE_OR_DIRECTORY_OR_ROOT,
      action: (state, { contextMenuTarget: target }) => {
        const type = "@reveal-in-files/open-in-file-explorer"
        const payload = target
          ? target.path
          : state.app.currentFile
          ? state.app.currentFile.path
          : state.app.userSettings["project.personal.directory"]

        if (!payload) return

        window.ordo.emit({ type, payload })
      },
    },
  ],
}

export default RevealInFilesCommandExtension
