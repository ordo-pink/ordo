import { IOrdoDirectory, IOrdoFile, OrdoDirectoryPath, OrdoFilePath } from "@ordo-pink/common-types"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"

/**
 * Removes userId from the path to get it back to the way it is used in the
 * client application.
 */
export const removeUserIdFromPath =
  (userId: string) =>
  (item: IOrdoDirectory | IOrdoFile): IOrdoDirectory | IOrdoFile =>
    OrdoDirectory.isOrdoDirectory(item)
      ? OrdoDirectory.of({
          ...item,
          path: item.path.replace(`/${userId}`, "") as OrdoDirectoryPath,
          children: item.children.map(removeUserIdFromPath(userId)),
        })
      : OrdoFile.of({
          ...item,
          path: item.path.replace(`/${userId}`, "") as OrdoFilePath,
        })
