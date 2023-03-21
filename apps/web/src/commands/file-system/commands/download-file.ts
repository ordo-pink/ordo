import { ActionContext, createOrdoCommand } from "@ordo-pink/extensions"
import { IOrdoFile, OrdoFile, OrdoDirectory } from "@ordo-pink/fs-entity"

const download = (file: IOrdoFile) => {
  window.ordo.api.fs.files
    .getBlob(file.path)
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
  Icon: () => import("../components/download-file-icon"),
  title: "@ordo-command-file-system/download-file",
  accelerator: "alt+d",
  showInCommandPalette: ({ state }: ActionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Boolean((state as any)["ordo-activity-editor"]?.currentFile)
  },
  showInContextMenu: OrdoFile.isOrdoFile,
  action: ({ contextMenuTarget, state }: ActionContext) => {
    if (contextMenuTarget && !OrdoDirectory.isOrdoDirectory(contextMenuTarget)) {
      return void download(contextMenuTarget)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((state as any)["ordo-activity-editor"]?.currentFile) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      download((state as any)["ordo-activity-editor"]?.currentFile)
    }
  },
})
