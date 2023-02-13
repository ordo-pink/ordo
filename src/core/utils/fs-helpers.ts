import {
  IOrdoDirectory,
  IOrdoFile,
  OrdoDirectory,
  OrdoDirectoryPath,
  OrdoFilePath,
  Nullable,
} from "@ordo-pink/core"

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
