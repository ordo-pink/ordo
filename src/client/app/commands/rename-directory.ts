import type { OrdoCommand } from "@core/types"
import type { AppScope } from "@client/app/types"
import type { OrdoDirectory, OrdoFile } from "@core/app/types"

import { showRenameModal } from "@client/rename-modal/store"
import { ExtensionContextMenuLocation } from "@core/constants"
import { isDirectory } from "@client/common/is-directory"
import { noOp } from "@client/common/utils/no-op"
import Either from "@client/common/utils/either"

export const renameDirectoryCommand: OrdoCommand<AppScope> = {
  title: "@app/rename-directory",
  icon: "BsPencilFill",
  showInContextMenu: ExtensionContextMenuLocation.DIRECTORY,
  action: (_, { dispatch, contextMenuTarget }) =>
    Either.fromNullable(contextMenuTarget)
      .chain((target: OrdoFile | OrdoDirectory) =>
        Either.fromBoolean(isDirectory(target)).map(() => showRenameModal(target))
      )
      .fold(noOp, dispatch),
}
