import type { OrdoCommand } from "@core/types"
import type { AppScope } from "@client/app/types"

import { ExtensionContextMenuLocation } from "@core/constants"
import { deleteFileOrDirectory } from "@client/app/store"

export const deleteDirectoryCommand: OrdoCommand<AppScope> = {
  title: "@app/delete-directory",
  icon: "BsTrashFill",
  showInContextMenu: ExtensionContextMenuLocation.DIRECTORY,
  action: (_, { dispatch, contextMenuTarget }) => {
    // TODO: Show confirmation dialog if not disabled by the user
    const path = contextMenuTarget?.path

    if (!path) return

    dispatch(deleteFileOrDirectory(path))
  },
}
