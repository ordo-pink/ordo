import { showDeleteDirectoryModal } from "$commands/file-system/store"

import { createOrdoCommand } from "$core/extensions/create-ordo-command"
import { isOrdoDirectory } from "$core/guards/is-fs-entity"

export const DeleteDirectoryCommand = createOrdoCommand<"ordo-command-file-system">({
  Icon: () => import("$commands/file-system/components/delete-directory-icon"),
  title: "@ordo-command-file-system/delete-directory",
  showInCommandPalette: false,
  showInContextMenu: (target) => isOrdoDirectory(target) && target.path !== "/",
  action: ({ dispatch, contextMenuTarget }) => {
    if (!contextMenuTarget || !isOrdoDirectory(contextMenuTarget)) return

    dispatch(showDeleteDirectoryModal(contextMenuTarget))
  },
})
