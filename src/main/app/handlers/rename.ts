import { ORDO_FILE_EXTENSION, ORDO_METADATA_EXTENSION } from "@core/app/constants"
import { promises } from "fs"
import userSettingsStore from "../user-settings-store"
import { handleListFolder } from "./list-folder"

type Params = {
  oldPath: string
  newPath: string
}

export const handleRename = async ({ oldPath, newPath }: Params) => {
  const rootPath = userSettingsStore.get("project.personal.directory")

  // TODO: 98
  // TODO: 99

  const oldPathIsOrdoFile = oldPath.endsWith(ORDO_FILE_EXTENSION)
  const newPathIsOrdoFile = newPath.endsWith(ORDO_FILE_EXTENSION)

  if (oldPathIsOrdoFile) {
    const oldMetadataPath = oldPath + ORDO_METADATA_EXTENSION

    if (!newPathIsOrdoFile) {
      // Remove Ordo Metadata if a file is converted from Ordo file to other format
      await Promise.all([promises.rename(oldPath, newPath), promises.unlink(oldMetadataPath)])
    } else {
      // Move both Ordo file and Ordo Metadata file to new location
      const newMetadataPath = newPath + ORDO_METADATA_EXTENSION

      await Promise.all([
        promises.rename(oldPath, newPath),
        promises.rename(oldMetadataPath, newMetadataPath),
      ])
    }
  } else if (newPathIsOrdoFile) {
    // Create new Ordo Metadata since the file is being converted to Ordo file format
    const newMetadataPath = newPath + ORDO_METADATA_EXTENSION

    await Promise.all([
      promises.rename(oldPath, newPath),
      promises.writeFile(newMetadataPath, "{}", "utf8"),
    ])
  } else {
    // Simply move the file to wherever it should go
    await promises.rename(oldPath, newPath)
  }

  return handleListFolder(rootPath)
}
