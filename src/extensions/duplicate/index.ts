import type { OrdoCommandExtension } from "@core/types"
import type { OrdoFile } from "@core/app/types"
import type { RootNode } from "@core/editor/types"

import { ExtensionContextMenuLocation } from "@core/constants"
import { listFolder } from "@client/app/store"
import { isFolder } from "@core/app/is-folder"
import { createRoot } from "@core/app/parsers/create-root"

type TSaveFileParams = RootNode["data"] & { path: string }

const RevealInFilesCommandExtension: OrdoCommandExtension<"duplicate"> = {
  name: "ordo-command-duplicate",
  translations: {
    en: { "@duplicate/duplicate-file-or-folder": "Duplicate" },
    ru: { "@duplicate/duplicate-file-or-folder": "Создать копию" },
  },
  commands: [
    {
      title: "@duplicate/duplicate-file-or-folder",
      icon: "BsFiles",
      accelerator: "shift+alt+d",
      showInContextMenu: ExtensionContextMenuLocation.FILE,
      showInCommandPalette: false,
      action: async (state, { target, dispatch }) => {
        if (!target || isFolder(target)) return

        const { raw } = await window.ordo.emit<{ file: OrdoFile; raw: string }, OrdoFile>({
          type: "@app/openFile",
          payload: target,
        })

        const separator = target.path.lastIndexOf(".")
        const nameBeforeExtension = target.path.slice(0, separator)
        const extension = target.path.slice(separator)
        const path = nameBeforeExtension.concat(" copy").concat(extension)
        const rootNode = createRoot(raw)

        const payload: any = { ...rootNode, raw, path }

        await window.ordo.emit<void, TSaveFileParams>({ type: "@app/saveFile", payload })

        dispatch(listFolder(state.app.userSettings["project.personal.directory"]))
      },
    },
  ],
}

export default RevealInFilesCommandExtension
