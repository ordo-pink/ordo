import { createOrdoCommand } from "@ordo-pink/extensions"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(showCreateDirectoryModal(target as any))
  },
})
