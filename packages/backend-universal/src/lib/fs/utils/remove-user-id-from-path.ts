import {
  IOrdoDirectoryRaw,
  IOrdoFileRaw,
  OrdoDirectoryPath,
  OrdoFilePath,
} from "@ordo-pink/common-types"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"

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
