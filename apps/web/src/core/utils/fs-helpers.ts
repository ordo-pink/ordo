import { Nullable } from "@ordo-pink/common-types"
import {
  IOrdoFile,
  IOrdoDirectory,
  OrdoFilePath,
  OrdoDirectoryPath,
  OrdoDirectory,
  OrdoFile,
} from "@ordo-pink/fs-entity"

// TODO: Move elsewhere
export const findParent = (
  child: IOrdoFile | IOrdoDirectory | OrdoFilePath | OrdoDirectoryPath,
  root: Nullable<IOrdoDirectory>,
) => {
  if (!root) return null

  const path = typeof child === "string" ? child : child.path

  const parentPathChunks = path.endsWith("/")
    ? path.slice(0, -1).split("/").slice(0, -1).filter(Boolean)
    : path.split("/").slice(0, -1).filter(Boolean)

  if (!parentPathChunks.length) {
    return root
  }

  let parent: IOrdoDirectory = root

  for (const chunk of parentPathChunks) {
    const found = parent.children.find((child) => child.path === `${parent.path}${chunk}/`)

    if (!found || !OrdoDirectory.isOrdoDirectory(found)) return parent

    parent = found
  }

  return parent
}

export const findOrdoFile = (
  child: IOrdoFile | IOrdoDirectory | OrdoFilePath | OrdoDirectoryPath,
  root: Nullable<IOrdoDirectory>,
) => {
  if (!root) return null

  const path = typeof child === "string" ? child : child.path

  const parent = findParent(path, root)

  const found = parent?.children.find((child) => child.path === path)

  if (!found || OrdoDirectory.isOrdoDirectory(found)) return null

  return found
}

export const findOrdoDirectory = (
  child: IOrdoDirectory | OrdoFilePath | OrdoDirectoryPath,
  root: Nullable<IOrdoDirectory>,
) => {
  if (!root || !child) return null

  const path = typeof child === "string" ? child : child.path

  const parent = findParent(path, root)

  const found = parent?.children.find((child) => child.path === path)

  if (!found || OrdoFile.isOrdoFile(found)) return null

  return found
}

export const getFiles = (directory: Nullable<IOrdoDirectory>, files: IOrdoFile[] = []) => {
  if (!directory) return files

  for (const item of directory.children) {
    if (OrdoDirectory.isOrdoDirectory(item)) {
      getFiles(item, files)
    } else {
      files.push(item)
    }
  }

  return files
}
