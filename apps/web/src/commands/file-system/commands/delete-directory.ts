import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { createOrdoCommand } from "../../../core/extensions/create-ordo-command"
import { showDeleteDirectoryModal } from "../store"

export const DeleteDirectoryCommand = createOrdoCommand<"ordo-command-file-system">({
  Icon: () => import("../components/delete-directory-icon"),
  title: "@ordo-command-file-system/delete-directory",
  showInCommandPalette: false,
  showInContextMenu: (target) => OrdoDirectory.isOrdoDirectory(target) && target.path !== "/",
  action: ({ dispatch, contextMenuTarget }) => {
    if (!contextMenuTarget || !OrdoDirectory.isOrdoDirectory(contextMenuTarget)) return

    dispatch(showDeleteDirectoryModal(contextMenuTarget))
  },
})
