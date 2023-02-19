import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { createOrdoCommand } from "../../../core/extensions/create-ordo-command"
import { showCreateFileModal } from "../store"

export const CreateFileCommand = createOrdoCommand<"ordo-command-file-system">({
  Icon: () => import("../components/create-file-icon"),
  title: "@ordo-command-file-system/create-file",
  accelerator: "alt+n",
  showInCommandPalette: true,
  showInContextMenu: OrdoDirectory.isOrdoDirectory,
  action: ({ dispatch, contextMenuTarget, state }) => {
    const target =
      contextMenuTarget && OrdoDirectory.isOrdoDirectory(contextMenuTarget)
        ? contextMenuTarget
        : state.personalProject

    dispatch(showCreateFileModal(target))
  },
})
