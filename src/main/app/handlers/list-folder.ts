import type { OrdoFolder } from "@core/app/types"

import { promises, existsSync } from "fs"
import { join } from "path"

import { Color } from "@core/colors"
import { createOrdoFolder } from "@main/app/create-ordo-folder"
import { createOrdoFile } from "@main/app/create-ordo-file"
import { sortOrdoFolder } from "@main/app/sort-ordo-folder"
import { ORDO_METADATA_EXTENSION, ORDO_FILE_EXTENSION } from "@core/app/constants"

export const handleListFolder = async (
  path: string,
  depth = 0,
  rootPath = path
): Promise<OrdoFolder> => {
  // Check if provided path exists
  if (!existsSync(path)) {
    // TODO: 95
    throw new Error("app.error.list-folder.path-does-not-exist")
  }

  const stat = await promises.stat(path)

  // Check if provided path is a folder
  if (!stat.isDirectory()) {
    // TODO: 95
    throw new Error("app.error.list-folder.not-a-folder")
  }

  // Get the list of files inside the folder
  const folder = await promises.readdir(path, {
    withFileTypes: true,
    encoding: "utf8",
  })

  const relativePath = path.replace(rootPath, "")

  // Create a tree structure for the folder
  const ordoFolder = createOrdoFolder({
    depth,
    path,
    relativePath,
    createdAt: stat.birthtime,
    updatedAt: stat.mtime,
    accessedAt: stat.atime,
  })

  for (const item of folder) {
    const itemPath = join(path, item.name)

    // TODO: 96
    // TODO: 97

    if (item.isDirectory()) {
      ordoFolder.children.push(await handleListFolder(itemPath, depth + 1, rootPath))
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

      ordoFolder.children.push(ordoFile)
    }
  }

  return sortOrdoFolder(ordoFolder)
}
