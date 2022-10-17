import { ORDO_FILE_EXTENSION, ORDO_METADATA_EXTENSION } from "@core/app/constants"
import { shell } from "electron"
import userSettingsStore from "../user-settings-store"
import { handleListDirectory } from "./list-directory"
import { promises } from "fs"

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
