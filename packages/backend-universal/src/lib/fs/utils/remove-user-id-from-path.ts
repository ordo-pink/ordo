import {
  IOrdoDirectoryRaw,
  IOrdoFileRaw,
  OrdoDirectoryPath,
  OrdoFilePath,
} from "@ordo-pink/common-types"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"

/**
 * Removes userId from the path to get it back to the way it is used in the
 * client application.
 */
export const removeUserIdFromPath =
  (userId: string) =>
  (item: IOrdoDirectoryRaw | IOrdoFileRaw): IOrdoDirectoryRaw | IOrdoFileRaw =>
    OrdoDirectory.isOrdoDirectoryRaw(item)
      ? OrdoDirectory.raw({
          ...item,
          path: item.path.replace(`/${userId}`, "") as OrdoDirectoryPath,
          children: item.children.map(removeUserIdFromPath(userId)),
        })
      : OrdoFile.raw({
          ...item,
          path: item.path.replace(`/${userId}`, "") as OrdoFilePath,
        })
