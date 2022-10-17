import type { OrdoDirectory } from "@core/app/types"

import { promises, existsSync } from "fs"
import { join } from "path"

import { Color } from "@core/colors"
import { createOrdoDirectory } from "@main/app/create-ordo-directory"
import { createOrdoFile } from "@main/app/create-ordo-file"
import { sortOrdoDirectory } from "@main/app/sort-ordo-directory"
import { ORDO_METADATA_EXTENSION, ORDO_FILE_EXTENSION } from "@core/app/constants"

export const handleListDirectory = async (
  path: string,
  depth = 0,
  rootPath = path
): Promise<OrdoDirectory> => {
  // Check if provided path exists
  if (!existsSync(path)) {
    throw new Error("app.error.list-directory.path-does-not-exist")
  }

  const stat = await promises.stat(path)

  // Check if provided path is a directory
  if (!stat.isDirectory()) {
    throw new Error("app.error.list-directory.not-a-directory")
  }

  // Get the list of files inside the directory
  const directory = await promises.readdir(path, {
    withFileTypes: true,
    encoding: "utf8",
  })

  const relativePath = path.replace(rootPath, "")

  // Create a tree structure for the directory
  const ordoDirectory = createOrdoDirectory({
    depth,
    path,
    relativePath,
    createdAt: stat.birthtime,
    updatedAt: stat.mtime,
    accessedAt: stat.atime,
  })

  for (const item of directory) {
    const itemPath = join(path, item.name)

    if (item.isDirectory()) {
      ordoDirectory.children.push(await handleListDirectory(itemPath, depth + 1, rootPath))
    } else if (item.isFile()) {
      const isMetadataFile = item.name.endsWith(ORDO_METADATA_EXTENSION)

      // Skip metadata files right now because they are handled separately
      if (isMetadataFile) continue

      const { birthtime, mtime, atime, size } = await promises.stat(itemPath)
      const relativePath = itemPath.replace(rootPath, "")

      const ordoFile = createOrdoFile({
        path: itemPath,
        depth: depth + 1,
        relativePath,
        createdAt: birthtime,
        updatedAt: mtime,
        accessedAt: atime,
        size,
      })

      if (ordoFile.extension === ORDO_FILE_EXTENSION) {
        const metadataPath = `${ordoFile.path}${ORDO_METADATA_EXTENSION}`

        if (existsSync(metadataPath)) {
          try {
            const metadataContent = await promises.readFile(metadataPath, "utf8")
            ordoFile.metadata = JSON.parse(metadataContent)
          } catch (e) {
            ordoFile.metadata = {
              color: Color.NEUTRAL,
              tags: [],
              checkboxes: [],
              dates: [],
              links: [],
              raw: "",
            }
          }
        }
      }

      ordoDirectory.children.push(ordoFile)
    }
  }

  return sortOrdoDirectory(ordoDirectory)
}
