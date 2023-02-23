import type { OrdoCommand } from "@core/types"
import type { AppScope } from "@client/app/types"

import { showCreateDirectoryModal } from "@client/create-modal/store"
import { ExtensionContextMenuLocation } from "@core/constants"
import { noOp } from "@client/common/utils/no-op"
import Either from "@client/common/utils/either"

export const createDirectoryCommand: OrdoCommand<AppScope> = {
  title: "@app/create-directory",
  icon: "BsFolderPlus",
  accelerator: "ctrl+shift+n",
  showInCommandPalette: true,
  showInContextMenu: ExtensionContextMenuLocation.DIRECTORY_OR_ROOT,
  action: (state, { dispatch, contextMenuTarget }) => {
    const target = Either.fromNullable(contextMenuTarget).getOrElse(
      () => state.app.personalDirectory
    )

    Either.of(target).map(showCreateDirectoryModal).fold(noOp, dispatch)
  },
}
