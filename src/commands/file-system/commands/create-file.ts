import { showCreateFileModal } from "$commands/file-system/store"

import { createOrdoCommand } from "$core/extensions/create-ordo-command"
import { isOrdoDirectory } from "$core/guards/is-fs-entity"

export const CreateFileCommand = createOrdoCommand<"ordo-command-file-system">({
  Icon: () => import("$commands/file-system/components/create-file-icon"),
  title: "@ordo-command-file-system/create-file",
  accelerator: "alt+n",
  showInCommandPalette: true,
  showInContextMenu: isOrdoDirectory,
  action: ({ dispatch, contextMenuTarget, state }) => {
    const target =
      contextMenuTarget && isOrdoDirectory(contextMenuTarget)
        ? contextMenuTarget
        : state.personalProject

    dispatch(showCreateFileModal(target))
  },
})
