import {
  IOrdoDirectoryRaw,
  IOrdoFileRaw,
  OrdoDirectory,
  OrdoDirectoryPath,
  OrdoFile,
  OrdoFilePath,
} from "@ordo-pink/fs-entity"

export const removeUserIdFromPath =
  (userId: string) =>
  (item: IOrdoDirectoryRaw | IOrdoFileRaw): IOrdoDirectoryRaw | IOrdoFileRaw =>
    OrdoDirectory.isOrdoDirectoryRaw(item)
      ? OrdoDirectory.raw({
          path: item.path.replace(`/${userId}`, "") as OrdoDirectoryPath,
          children: item.children.map(removeUserIdFromPath(userId)),
        })
      : OrdoFile.raw({
          ...item,
          path: item.path.replace(`/${userId}`, "") as OrdoFilePath,
        })
