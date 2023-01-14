import { promises } from "fs"
import { join } from "path"

import type { OrdoDirectoryPath, OrdoFilePath, Nullable, OrdoDirectory } from "$core/types"
import { createOrdoDirectory } from "$fs/driver/utils/create-ordo-directory"
import { createOrdoFile } from "$fs/driver/utils/create-ordo-file"
import { sortOrdoDirectory } from "$fs/driver/utils/sort-ordo-directory"

export const listDirectory = async (
  path: string,
  dir: string,
  depth = 0,
  rootPath = path,
): Promise<Nullable<OrdoDirectory>> => {
  const stat = await promises.stat(path)

  const normalizedDir = dir.replaceAll("\\", "/")

  if (!stat.isDirectory()) {
    return null
  }

  const directory = await promises.readdir(path, {
    withFileTypes: true,
    encoding: "utf-8",
  })

  const ordoDirectory = createOrdoDirectory({
    depth,
    path: `/${path.replace(normalizedDir, "")}` as OrdoDirectoryPath,
    createdAt: new Date(stat.birthtime),
    updatedAt: new Date(stat.mtime),
    accessedAt: new Date(stat.atime),
  })

  for (const item of directory) {
    let itemPath = join(path, item.name).replaceAll("\\", "/")

    if (item.isDirectory()) {
      if (!itemPath.endsWith("/")) {
        itemPath = `${itemPath}/`
      }

      const listedDirectory = await listDirectory(
        itemPath as OrdoDirectoryPath,
        dir,
        depth + 1,
        rootPath,
      )

      if (!listedDirectory) continue

      ordoDirectory.children.push(listedDirectory)
    } else if (item.isFile()) {
      const stat = await promises.stat(itemPath)

      if (itemPath.endsWith("/")) {
        itemPath = itemPath.slice(0, -1)
      }

      const ordoFile = createOrdoFile({
        depth: depth + 1,
        path: `/${itemPath.replace(normalizedDir, "")}` as OrdoFilePath,
        createdAt: stat.birthtime,
        updatedAt: stat.mtime,
        accessedAt: stat.atime,
        size: stat.size,
      })

      ordoDirectory.children.push(ordoFile)
    }
  }

  return sortOrdoDirectory(ordoDirectory)
}
