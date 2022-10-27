import type { OrdoCommandExtension } from "@core/types"
import type { OrdoDirectory, OrdoFile } from "@core/app/types"
import type { RootNode } from "@client/editor/types"

import { ExtensionContextMenuLocation } from "@core/constants"
import { deleteFileOrDirectory, listDirectory, openFile } from "@client/app/store"
import { isDirectory } from "@client/common/is-directory"
import { createRoot } from "@core/app/parsers/create-root"
import { parseMetadata } from "@core/app/parsers/parse-ordo-file"
import { ORDO_FILE_EXTENSION } from "@core/app/constants"

type TSaveFileParams = RootNode["data"] & { path: string }

const MdToIsmCommandExtension: OrdoCommandExtension<"md-to-ism"> = {
  name: "ordo-command-md-to-ism",
  translations: {
    en: { "md-to-ism": "Transform to Ordo format" },
    ru: { "md-to-ism": "Преобразовать в формат Ordo" },
  },
  commands: [
    {
      title: "md-to-ism",
      icon: "BsFileCheck",
      showInContextMenu: (item) => Boolean(item) && !isDirectory(item) && item.extension === ".md",
      showInCommandPalette: (currentFile) =>
        Boolean(currentFile) && currentFile?.extension === ".md",
      action: async (state, { contextMenuTarget, dispatch, currentFile }) => {
        if (!contextMenuTarget && !currentFile) return
        if (contextMenuTarget && isDirectory(contextMenuTarget)) return

        const source = contextMenuTarget ? contextMenuTarget : currentFile

        if (!source) return

        const { raw } = await window.ordo.emit<{ file: OrdoFile; raw: string }, OrdoFile>({
          type: "@app/openFile",
          payload: source,
        })

        const newRaw = raw
          .replace(/^# /, "+++++ ")
          .replace(/^## /, "++++ ")
          .replace(/^### /, "+++ ")
          .replace(/^#### /, "++ ")
          .replace(/^##### /, "+ ")
          .replace(/^[ ] /, "( ) ")
          .replace(/^[x] /, "(*) ")
          .replace(/^- [ ] /, "( ) ")
          .replace(/^- [x] /, "(*) ")
          .replaceAll("\n# ", "\n+++++ ")
          .replaceAll("\n## ", "\n++++ ")
          .replaceAll("\n### ", "\n+++ ")
          .replaceAll("\n#### ", "\n++ ")
          .replaceAll("\n##### ", "\n+ ")
          .replaceAll("\n[ ] ", "\n( ) ")
          .replaceAll("\n[x] ", "\n(*) ")
          .replaceAll("\n- [ ] ", "\n( ) ")
          .replaceAll("\n- [x] ", "\n(*) ")
          .replaceAll(/\[\[([\p{L}\d.\s/\-,_]+)\]\]/giu, (value) => `((${value.slice(2, -2)}))`)
          .replaceAll(/#([\p{L}\d\-./]+)/giu, (value) => `--${value.slice(1)}`)

        const newPath = source.path.slice(0, -3).concat(ORDO_FILE_EXTENSION)

        const rootNode = createRoot(newRaw)
        const node = parseMetadata(rootNode)

        const payload = { ...node.data, raw: newRaw, path: newPath }

        await window.ordo.emit<void, TSaveFileParams>({ type: "@app/saveFile", payload })

        await dispatch(deleteFileOrDirectory(source.path))
        await dispatch(listDirectory(state.app.userSettings["project.personal.directory"]))

        dispatch(openFile(newPath))
      },
    },
  ],
}

export default MdToIsmCommandExtension
