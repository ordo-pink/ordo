import { createOrdoCommand } from "@ordo-pink/extensions"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(showCreateFileModal(target as any))
  },
})
