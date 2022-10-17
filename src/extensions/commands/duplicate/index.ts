import type { OrdoCommandExtension } from "@core/types"
import type { OrdoFile } from "@core/app/types"
import type { RootNode } from "@core/editor/types"

import { ExtensionContextMenuLocation } from "@core/constants"
import { listDirectory } from "@client/app/store"
import { isDirectory } from "@core/app/is-directory"
import { createRoot } from "@core/app/parsers/create-root"
import { parseMetadata } from "@core/app/parsers/parse-ordo-file"

type TSaveFileParams = RootNode["data"] & { path: string }

// TODO: Add command palette
const RevealInFilesCommandExtension: OrdoCommandExtension<"duplicate"> = {
  name: "ordo-command-duplicate",
  translations: {
    en: { "@duplicate/duplicate-file-or-directory": "Duplicate" },
    ru: { "@duplicate/duplicate-file-or-directory": "Создать копию" },
  },
  commands: [
    {
      title: "@duplicate/duplicate-file-or-directory",
      icon: "BsFiles",
      accelerator: "shift+alt+d",
      showInContextMenu: ExtensionContextMenuLocation.FILE,
      showInCommandPalette: false,
      action: async (state, { target, dispatch }) => {
        if (!target || isDirectory(target)) return

        const { raw } = await window.ordo.emit<{ file: OrdoFile; raw: string }, OrdoFile>({
          type: "@app/openFile",
          payload: target,
        })

        const separator = target.path.lastIndexOf(".")
        const nameBeforeExtension = target.path.slice(0, separator)
        const extension = target.path.slice(separator)
        const path = nameBeforeExtension.concat(" copy").concat(extension)
        const rootNode = createRoot(raw)
        const node = parseMetadata(rootNode)

        const payload = { ...node.data, raw, path }

        await window.ordo.emit<void, TSaveFileParams>({ type: "@app/saveFile", payload })

        dispatch(listDirectory(state.app.userSettings["project.personal.directory"]))
      },
    },
  ],
}

export default RevealInFilesCommandExtension
