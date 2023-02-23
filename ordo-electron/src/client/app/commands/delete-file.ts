import type { AppScope } from "@client/app/types"
import type { OrdoCommand } from "@core/types"

import { ExtensionContextMenuLocation } from "@core/constants"
import { deleteFileOrDirectory } from "@client/app/store"

export const deleteFileCommand: OrdoCommand<AppScope> = {
  title: "@app/delete-file",
  icon: "BsTrash",
  accelerator: "ctrl+alt+backspace",
  showInCommandPalette: true,
  showInContextMenu: ExtensionContextMenuLocation.FILE,
  action: (_, { dispatch, currentFile, contextMenuTarget }) => {
    // TODO: Show confirmation dialog if not disabled by the user
    const path = contextMenuTarget ? contextMenuTarget.path : currentFile?.path

    if (!path) return

    dispatch(deleteFileOrDirectory(path))
  },
}
