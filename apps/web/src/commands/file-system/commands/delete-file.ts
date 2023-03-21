import { ActionContext, createOrdoCommand } from "@ordo-pink/extensions"
import { OrdoFile, OrdoDirectory } from "@ordo-pink/fs-entity"
import { showDeleteFileModal } from "../store"

export const DeleteFileCommand = createOrdoCommand<"ordo-command-file-system">({
  Icon: () => import("../components/delete-file-icon"),
  title: "@ordo-command-file-system/delete-file",
  accelerator: "alt+backspace",
  showInCommandPalette: ({ state }: ActionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Boolean((state as any)["ordo-activity-editor"]?.currentFile)
  },
  showInContextMenu: OrdoFile.isOrdoFile,
  action: ({ dispatch, contextMenuTarget, state }: ActionContext) => {
    if (contextMenuTarget && !OrdoDirectory.isOrdoDirectory(contextMenuTarget)) {
      return void dispatch(showDeleteFileModal(contextMenuTarget))
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((state as any)["ordo-activity-editor"]?.currentFile) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(showDeleteFileModal((state as any)["ordo-activity-editor"]?.currentFile))
    }
  },
})
