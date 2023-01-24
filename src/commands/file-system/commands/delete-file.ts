import type EditorExtension from "$activities/editor"

import { showDeleteFileModal } from "$commands/file-system/store"

import { createOrdoCommand } from "$core/extensions/create-ordo-command"
import { isOrdoFile, isOrdoDirectory } from "$core/guards/is-fs-entity"
import { ActionContext } from "$core/types"

export const DeleteFileCommand = createOrdoCommand<"ordo-command-file-system">({
  Icon: () => import("$commands/file-system/components/delete-file-icon"),
  title: "@ordo-command-file-system/delete-file",
  accelerator: "alt+backspace",
  showInCommandPalette: ({ state }: ActionContext<typeof EditorExtension>) => {
    return Boolean(state["ordo-activity-editor"].currentFile)
  },
  showInContextMenu: isOrdoFile,
  action: ({ dispatch, contextMenuTarget, state }: ActionContext<typeof EditorExtension>) => {
    if (contextMenuTarget && !isOrdoDirectory(contextMenuTarget)) {
      return void dispatch(showDeleteFileModal(contextMenuTarget))
    }

    if (state["ordo-activity-editor"].currentFile) {
      dispatch(showDeleteFileModal(state["ordo-activity-editor"].currentFile))
    }
  },
})
