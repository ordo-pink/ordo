import type { OrdoCommandExtension } from "@core/types"

import { ExtensionContextMenuLocation } from "@core/constants"
import { showRenameModal } from "@client/rename-modal/store"
import { OrdoDirectory } from "@core/app/types"

const CreateCommandExtension: OrdoCommandExtension<"rename"> = {
  name: "ordo-command-rename",
  translations: {
    en: {
      "@rename/file-or-directory": "Rename",
    },
    ru: {
      "@rename/file-or-directory": "Переименовать",
    },
  },
  commands: [
    {
      title: "@rename/file-or-directory",
      icon: "BsPencilSquare",
      accelerator: "f2",
      showInCommandPalette: true,
      showInContextMenu: ExtensionContextMenuLocation.FILE_OR_DIRECTORY,
      action: (state, { dispatch, contextMenuTarget, currentFile }) =>
        dispatch(
          showRenameModal(
            contextMenuTarget
              ? (contextMenuTarget as OrdoDirectory)
              : currentFile
              ? currentFile
              : state.app.personalDirectory
          )
        ),
    },
  ],
}

export default CreateCommandExtension
