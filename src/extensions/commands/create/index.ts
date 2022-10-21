import type { OrdoCommandExtension } from "@core/types"

import { ExtensionContextMenuLocation } from "@core/constants"
import { showCreateFileModal, showCreateDirectoryModal } from "@client/create-modal/store"
import { OrdoDirectory } from "@core/app/types"

const CreateCommandExtension: OrdoCommandExtension<"create"> = {
  name: "ordo-command-create",
  translations: {
    en: {
      "@create/file": "Create file",
      "@create/directory": "Create directory",
    },
    ru: {
      "@create/file": "Создать файл",
      "@create/directory": "Создать папку",
    },
  },
  commands: [
    {
      title: "@create/file",
      icon: "BsFilePlus",
      accelerator: "ctrl+n",
      showInCommandPalette: true,
      showInContextMenu: ExtensionContextMenuLocation.DIRECTORY,
      action: (state, { dispatch, target }) =>
        dispatch(
          showCreateFileModal(target ? (target as OrdoDirectory) : state.app.personalDirectory)
        ),
    },
    {
      title: "@create/directory",
      icon: "BsFolderPlus",
      accelerator: "ctrl+shift+n",
      showInCommandPalette: true,
      showInContextMenu: ExtensionContextMenuLocation.DIRECTORY,
      action: (state, { dispatch, target }) =>
        dispatch(
          showCreateDirectoryModal(target ? (target as OrdoDirectory) : state.app.personalDirectory)
        ),
    },
  ],
}

export default CreateCommandExtension
