import { OrdoDirectory } from "@ordo-pink/core"
import { showDeleteDirectoryModal } from "$commands/file-system/store"

import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export const DeleteDirectoryCommand = createOrdoCommand<"ordo-command-file-system">({
  Icon: () => import("$commands/file-system/components/delete-directory-icon"),
  title: "@ordo-command-file-system/delete-directory",
  showInCommandPalette: false,
  showInContextMenu: (target) => OrdoDirectory.isOrdoDirectory(target) && target.raw.path !== "/",
  action: ({ dispatch, contextMenuTarget }) => {
    if (!contextMenuTarget || !OrdoDirectory.isOrdoDirectory(contextMenuTarget)) return

    dispatch(showDeleteDirectoryModal(contextMenuTarget))
  },
})
