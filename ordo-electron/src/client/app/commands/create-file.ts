import type { AppScope } from "@client/app/types"
import type { OrdoCommand } from "@core/types"

import { showCreateFileModal } from "@client/create-modal/store"
import { ExtensionContextMenuLocation } from "@core/constants"
import { noOp } from "@client/common/utils/no-op"
import Either from "@client/common/utils/either"

export const createFileCommand: OrdoCommand<AppScope> = {
  title: "@app/create-file",
  icon: "BsFilePlus",
  accelerator: "ctrl+n",
  showInCommandPalette: true,
  showInContextMenu: ExtensionContextMenuLocation.DIRECTORY_OR_ROOT,
  action: (state, { dispatch, contextMenuTarget }) => {
    const target = Either.fromNullable(contextMenuTarget).getOrElse(
      () => state.app.personalDirectory
    )

    Either.of(target).map(showCreateFileModal).fold(noOp, dispatch)
  },
}
