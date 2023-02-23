import {
  IOrdoDirectoryRaw,
  IOrdoFileRaw,
  OrdoDirectory,
  OrdoFile,
  OrdoFilePath,
} from "@ordo-pink/core"

export const removeUserIdFromPath =
  (userId: string) =>
  (item: IOrdoDirectoryRaw | IOrdoFileRaw): IOrdoDirectoryRaw | IOrdoFileRaw =>
    OrdoDirectory.isOrdoDirectoryRaw(item)
      ? OrdoDirectory.raw({
          path: item.path.replace(`/${userId}`, ""),
          children: item.children.map(removeUserIdFromPath(userId)),
        })
      : OrdoFile.raw({
          ...item,
          path: item.path.replace(`/${userId}`, "") as OrdoFilePath,
        })
