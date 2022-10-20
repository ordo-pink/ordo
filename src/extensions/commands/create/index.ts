import type { OrdoCommandExtension } from "@core/types"

import { ExtensionContextMenuLocation } from "@core/constants"
import { showCreateFileModal, showCreateDirectoryModal } from "@client/create-modal/store"

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
      action: (state, { dispatch }) => dispatch(showCreateFileModal(state.app.personalDirectory)),
    },
    {
      title: "@create/directory",
      icon: "BsFolderPlus",
      accelerator: "ctrl+shift+n",
      showInCommandPalette: true,
      action: (state, { dispatch }) =>
        dispatch(showCreateDirectoryModal(state.app.personalDirectory)),
    },
  ],
}

export default CreateCommandExtension
