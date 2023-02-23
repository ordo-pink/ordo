import { OrdoDirectory } from "@ordo-pink/core"
import { showCreateDirectoryModal } from "$commands/file-system/store"

import { createOrdoCommand } from "$core/extensions/create-ordo-command"

export const CreateDirectoryCommand = createOrdoCommand<"ordo-command-file-system">({
  Icon: () => import("$commands/file-system/components/create-directory-icon"),
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
