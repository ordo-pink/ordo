import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { createOrdoCommand } from "../../../core/extensions/create-ordo-command"
import { showCreateDirectoryModal } from "../store"

export const CreateDirectoryCommand = createOrdoCommand<"ordo-command-file-system">({
  Icon: () => import("../components/create-directory-icon"),
  title: "@ordo-command-file-system/create-directory",
  accelerator: "alt+shift+n",
  showInCommandPalette: true,
  showInContextMenu: OrdoDirectory.isOrdoDirectory,
  action: ({ dispatch, contextMenuTarget, state }) => {
    const target =
      contextMenuTarget && OrdoDirectory.isOrdoDirectory(contextMenuTarget)
        ? contextMenuTarget
        : state.personalProject

    dispatch(showCreateDirectoryModal(target))
  },
})
