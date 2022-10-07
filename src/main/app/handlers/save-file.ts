import type { RootNode } from "@core/editor/types"

import { promises } from "fs"

import { ORDO_FILE_EXTENSION, ORDO_METADATA_EXTENSION } from "@core/app/constants"
import { handleListFolder } from "@main/app/handlers/list-folder"
import userSettingsStore from "@main/app/user-settings-store"
import { parseMetadata, parseOrdoFile } from "@core/app/parsers/parse-ordo-file"

type TParams = RootNode["data"] & {
  path: string
}

export const handleSaveFile = async ({ path, raw }: TParams) => {
  const rootPath = userSettingsStore.get("project.personal.directory")
  const isOrdoFile = path.endsWith(ORDO_FILE_EXTENSION)

  if (!isOrdoFile) return

  const tree = parseOrdoFile(raw)
  const { checkboxes, links, dates, tags } = parseMetadata(tree).data

  await promises.writeFile(path, raw, "utf8")
  await promises.writeFile(
    path + ORDO_METADATA_EXTENSION,
    JSON.stringify({ checkboxes, links, dates, tags }),
    "utf8"
  )

  return handleListFolder(rootPath)
}
