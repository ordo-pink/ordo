import { createOrdoCommand } from "@ordo-pink/extensions"
import { IOrdoDirectory, OrdoDirectory } from "@ordo-pink/fs-entity"
import { findParent } from "../../../core/utils/fs-helpers"
import { showRenameDirectoryModal } from "../store"

export const RenameDirectoryCommand = createOrdoCommand<"ordo-command-file-system">({
  Icon: () => import("../components/rename-file-icon"),
  title: "@ordo-command-file-system/rename-directory",
  showInCommandPalette: false,
  showInContextMenu: (target) => OrdoDirectory.isOrdoDirectory(target) && target.path !== "/",
  action: ({ state, dispatch, contextMenuTarget }) => {
    if (!contextMenuTarget || !OrdoDirectory.isOrdoDirectory(contextMenuTarget)) return

    const parent = findParent(
      contextMenuTarget,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state as any).app.personalProject,
    ) as IOrdoDirectory

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(showRenameDirectoryModal({ target: contextMenuTarget as any, parent }))
  },
})
