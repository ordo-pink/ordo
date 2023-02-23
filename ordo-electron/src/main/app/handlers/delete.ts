import { shell } from "electron"
import { promises } from "fs"

import { ORDO_FILE_EXTENSION, ORDO_METADATA_EXTENSION } from "@core/app/constants"
import { handleListDirectory } from "@main/app/handlers/list-directory"
import userSettingsStore from "@main/app/user-settings-store"

export const handleDelete = async (path: string) => {
  await shell.trashItem(path)

  const isOrdoFile = path.endsWith(ORDO_FILE_EXTENSION)

  if (isOrdoFile) {
    // Remove Ordo Metadata if it is an Ordo file
    await promises.unlink(path + ORDO_METADATA_EXTENSION)
  }

  const rootPath = userSettingsStore.get("project.personal.directory")

  return handleListDirectory(rootPath)
}
