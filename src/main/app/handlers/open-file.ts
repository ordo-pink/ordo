import type { OrdoFile } from "@core/app/types"

import { createRoot } from "@core/app/parsers/create-root"
import { parseMetadata } from "@core/app/parsers/parse-ordo-file"
import { getFileReader } from "@main/app/get-file-reader"
import { createOrdoFile } from "../create-ordo-file"
import userSettingsStore from "../user-settings-store"

export const handleOpenFile = async (file: OrdoFile | string) => {
  const rootPath = userSettingsStore.get("project.personal.directory")

  const ordoFile =
    typeof file === "string"
      ? createOrdoFile({
          path: file,
          relativePath: file.replace(rootPath, ""),
          depth: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          accessedAt: new Date(),
          size: 0,
        })
      : file

  const fileReader = getFileReader(ordoFile)
  const raw = await fileReader(ordoFile)

  const root = createRoot(raw)
  const metadata = parseMetadata(root).data
  ordoFile.metadata = metadata as OrdoFile["metadata"]

  return { file: ordoFile, raw }
}
