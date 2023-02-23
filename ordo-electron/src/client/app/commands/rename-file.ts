import type { OrdoCommand } from "@core/types"
import type { AppScope } from "@client/app/types"

import { showRenameModal } from "@client/rename-modal/store"
import { ExtensionContextMenuLocation } from "@core/constants"
import { noOp } from "@client/common/utils/no-op"
import Switch from "@client/common/utils/switch"
import Either from "@client/common/utils/either"

export const renameFileCommand: OrdoCommand<AppScope> = {
  title: "@app/rename-file",
  icon: "BsPencil",
  accelerator: "f2",
  showInCommandPalette: true,
  showInContextMenu: ExtensionContextMenuLocation.FILE,
  action: (_, { dispatch, contextMenuTarget, currentFile }) =>
    Either.fromNullable(
      Switch.of(null)
        .case(() => Boolean(contextMenuTarget), contextMenuTarget)
        .case(() => Boolean(currentFile), currentFile)
        .default(null)
    )
      .map(showRenameModal)
      .fold(noOp, dispatch),
}
