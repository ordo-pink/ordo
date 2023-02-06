import type EditorExtension from "$activities/editor"

import { createOrdoCommand } from "$core/extensions/create-ordo-command"
import { isOrdoFile, isOrdoDirectory } from "$core/guards/is-fs-entity"
import { ActionContext, OrdoFile } from "$core/types"

const download = (file: OrdoFile) => {
  window.ordo.api.fs.files
    .getRaw(file.path)
    .then((res) => res.blob())
    .then((blob) => URL.createObjectURL(blob))
    .then((url) => {
      const a = document.createElement("a")
      a.href = url
      a.download = `${file.readableName}${file.extension}`
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 0)
    })
}

export const DownloadFileCommand = createOrdoCommand<"ordo-command-file-system">({
  Icon: () => import("$commands/file-system/components/download-file-icon"),
  title: "@ordo-command-file-system/download-file",
  accelerator: "alt+d",
  showInCommandPalette: ({ state }: ActionContext<typeof EditorExtension>) => {
    return Boolean(state["ordo-activity-editor"].currentFile)
  },
  showInContextMenu: isOrdoFile,
  action: ({ contextMenuTarget, state }: ActionContext<typeof EditorExtension>) => {
    if (contextMenuTarget && !isOrdoDirectory(contextMenuTarget)) {
      return void download(contextMenuTarget)
    }

    if (state["ordo-activity-editor"].currentFile) {
      download(state["ordo-activity-editor"].currentFile)
    }
  },
})
