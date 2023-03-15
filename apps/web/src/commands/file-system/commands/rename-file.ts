import { ActionContext, createOrdoCommand } from "@ordo-pink/extensions"
import { IOrdoDirectory, OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { findParent } from "../../../core/utils/fs-helpers"
import { showRenameFileModal } from "../store"

export const RenameFileCommand = createOrdoCommand<"ordo-command-file-system">({
  Icon: () => import("../components/rename-file-icon"),
  title: "@ordo-command-file-system/rename-file",
  showInCommandPalette: ({ state }: ActionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Boolean((state as any)["ordo-activity-editor"]?.currentFile)
  },
  showInContextMenu: OrdoFile.isOrdoFile,
  action: ({ dispatch, contextMenuTarget, state }: ActionContext) => {
    if (contextMenuTarget && !OrdoDirectory.isOrdoDirectory(contextMenuTarget)) {
      const parent = findParent(
        contextMenuTarget,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state as any).app.personalProject,
      ) as IOrdoDirectory
      return void dispatch(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        showRenameFileModal({ target: contextMenuTarget as any, parent, openOnRename: false }),
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((state as any)["ordo-activity-editor"]?.currentFile) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(showRenameFileModal((state as any)["ordo-activity-editor"]?.currentFile))
    }
  },
})
