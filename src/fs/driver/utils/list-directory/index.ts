import { promises } from "fs"
import { join } from "path"

import type { DirectoryPath, FilePath, Nullable, OrdoDirectory } from "$core/types"
import { createOrdoDirectory } from "$fs/driver/utils/create-ordo-directory"
import { createOrdoFile } from "$fs/driver/utils/create-ordo-file"
import { sortOrdoDirectory } from "$fs/driver/utils/sort-ordo-directory"

/**
 * @param {string} path
 * @param {number?} depth
 * @param {string?} rootPath
 */
export const listDirectory = async (
  path: DirectoryPath,
  dir: DirectoryPath,
  depth = 0,
  rootPath = path,
): Promise<Nullable<OrdoDirectory>> => {
  const absolutePath = join(dir, path)
  const stat = await promises.stat(absolutePath)

  if (!stat.isDirectory()) {
    return null
  }

  const directory = await promises.readdir(absolutePath, {
    withFileTypes: true,
    encoding: "utf-8",
  })

  const ordoDirectory = createOrdoDirectory({
    depth,
    path,
    createdAt: stat.birthtime,
    updatedAt: stat.mtime,
    accessedAt: stat.atime,
  })

  for (const item of directory) {
    let itemPath = join(path, item.name).replaceAll("\\", "/")

    const itemAbsolutePath = join(absolutePath, item.name)

    if (item.isDirectory()) {
      if (!itemPath.endsWith("/")) {
        itemPath = `${itemPath}/`
      }

      const listedDirectory = await listDirectory(
        itemPath as DirectoryPath,
        dir,
        depth + 1,
        rootPath,
      )

      if (!listedDirectory) continue

      ordoDirectory.children.push(listedDirectory)
    } else if (item.isFile()) {
      const stat = await promises.stat(itemAbsolutePath)

      if (itemPath.endsWith("/")) {
        itemPath = itemPath.slice(0, -1)
      }

      const ordoFile = createOrdoFile({
        path: itemPath as FilePath,
        depth: depth + 1,
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
