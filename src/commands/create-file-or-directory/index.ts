import {
  showCreateDirectoryModal,
  showCreateFileModal,
  slice,
} from "$commands/create-file-or-directory/store"

import { createCommandExtension } from "$core/extensions/create-command-extension"
import { isDirectory } from "$core/guards/is-directory"

export default createCommandExtension("create-file-or-directory", {
  commands: [
    {
      Icon: () => import("$commands/create-file-or-directory/components/create-file-icon"),
      title: "@ordo-command-create-file-or-directory/create-file",
      accelerator: "alt+n",
      showInCommandPalette: true,
      showInContextMenu: isDirectory,
      action: ({ dispatch, contextMenuTarget, state }) => {
        dispatch(
          showCreateFileModal(
            contextMenuTarget && isDirectory(contextMenuTarget)
              ? contextMenuTarget
              : state.personalProject,
          ),
        )
      },
    },
    {
      Icon: () => import("$commands/create-file-or-directory/components/create-directory-icon"),
      title: "@ordo-command-create-file-or-directory/create-directory",
      accelerator: "alt+shift+n",
      showInCommandPalette: true,
      showInContextMenu: isDirectory,
      action: ({ dispatch, contextMenuTarget, state }) => {
        dispatch(
          showCreateDirectoryModal(
            contextMenuTarget && isDirectory(contextMenuTarget)
              ? contextMenuTarget
              : state.personalProject,
          ),
        )
      },
    },
  ],
  overlayComponents: [() => import("$commands/create-file-or-directory/components/modal")],
  translations: {
    ru: {
      "@ordo-command-create-file-or-directory/readable-name": "Создание файлов и папок",
      "@ordo-command-create-file-or-directory/create-file": "Создать файл",
      "@ordo-command-create-file-or-directory/create-directory": "Создать папку",
      "@ordo-command-create-file-or-directory/placeholder": "Название",
      "@ordo-command-create-file-or-directory/button-ok": "Создать",
      "@ordo-command-create-file-or-directory/button-cancel": "Отмена",
      "@ordo-command-create-file-or-directory/description": "TODO",
    },
    en: {
      "@ordo-command-create-file-or-directory/readable-name": "Create file or directory",
      "@ordo-command-create-file-or-directory/create-file": "Create file",
      "@ordo-command-create-file-or-directory/create-directory": "Create directory",
      "@ordo-command-create-file-or-directory/placeholder": "Name",
      "@ordo-command-create-file-or-directory/button-ok": "Create",
      "@ordo-command-create-file-or-directory/button-cancel": "Cancel",
      "@ordo-command-create-file-or-directory/description": "TODO",
    },
  },
  readableName: "@ordo-command-create-file-or-directory/readable-name",
  storeSlice: slice,
  description: "@ordo-command-create-file-or-directory/description",
})
