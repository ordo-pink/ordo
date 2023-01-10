import {
  showDeleteDirectoryModal,
  showDeleteFileModal,
  slice,
} from "$commands/delete-file-or-directory/store"

import { createCommandExtension } from "$core/extensions/create-command-extension"
import { isOrdoDirectory, isOrdoFile } from "$core/guards/is-fs-entity"

export default createCommandExtension("delete-file-or-directory", {
  commands: [
    {
      Icon: () => import("$commands/delete-file-or-directory/components/delete-file-icon"),
      title: "@ordo-command-delete-file-or-directory/delete-file",
      accelerator: "alt+backspace",
      showInCommandPalette: false,
      showInContextMenu: isOrdoFile,
      action: ({ dispatch, contextMenuTarget }) => {
        if (!contextMenuTarget || isOrdoDirectory(contextMenuTarget)) return

        dispatch(showDeleteFileModal(contextMenuTarget))
      },
    },
    {
      Icon: () => import("$commands/delete-file-or-directory/components/delete-directory-icon"),
      title: "@ordo-command-delete-file-or-directory/delete-directory",
      showInCommandPalette: false,
      showInContextMenu: (target) => isOrdoDirectory(target) && target.path !== "/",
      action: ({ dispatch, contextMenuTarget }) => {
        if (!contextMenuTarget || !isOrdoDirectory(contextMenuTarget)) return

        dispatch(showDeleteDirectoryModal(contextMenuTarget))
      },
    },
  ],
  overlayComponents: [() => import("$commands/delete-file-or-directory/components/modal")],
  translations: {
    ru: {
      "@ordo-command-delete-file-or-directory/readable-name": "Удаление файлов и папок",
      "@ordo-command-delete-file-or-directory/delete-file": "Удалить файл",
      "@ordo-command-delete-file-or-directory/delete-directory": "Удалить папку",
      "@ordo-command-delete-file-or-directory/delete-confirmation":
        "Вы уверены, что хотите удалить {{path}}?",
      "@ordo-command-delete-file-or-directory/button-ok": "Удалить",
      "@ordo-command-delete-file-or-directory/button-cancel": "Отмена",
      "@ordo-command-delete-file-or-directory/description": "TODO",
    },
    en: {
      "@ordo-command-delete-file-or-directory/readable-name": "Delete file or directory",
      "@ordo-command-delete-file-or-directory/delete-file": "Delete file",
      "@ordo-command-delete-file-or-directory/delete-directory": "Delete directory",
      "@ordo-command-delete-file-or-directory/delete-confirmation":
        "Are you sure you want to remove {{path}}?",
      "@ordo-command-delete-file-or-directory/button-ok": "Delete",
      "@ordo-command-delete-file-or-directory/button-cancel": "Cancel",
      "@ordo-command-delete-file-or-directory/description": "TODO",
    },
  },
  readableName: "@ordo-command-delete-file-or-directory/readable-name",
  storeSlice: slice,
  description: "@ordo-command-delete-file-or-directory/description",
})
