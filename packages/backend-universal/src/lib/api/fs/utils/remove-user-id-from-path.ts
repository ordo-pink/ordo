import { DirectoryDTO, FileDTO, DirectoryPath, FilePath } from "@ordo-pink/common-types"
import { Directory, OrdoFile } from "@ordo-pink/fs-entity"

/**
 * Removes userId from the path to get it back to the way it is used in the
 * client application.
 */
export const removeUserIdFromPath =
  (userId: string) =>
  (item: DirectoryDTO | FileDTO): DirectoryDTO | FileDTO => {
    const path = item.path.replace(`/${userId}`, "")

    return Directory.isOrdoDirectory(item)
      ? Directory.from({
          ...item,
          path: path as DirectoryPath,
        }).toDTO
      : OrdoFile.from({
          ...item,
          path: path as FilePath,
        }).toDTO
  }
