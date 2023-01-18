import { isOrdoDirectory } from "$core/guards/is-fs-entity"
import { Nullable, OrdoDirectory, OrdoFile } from "$core/types"

// TODO: Move elsewhere
export const findParent = (
  child: OrdoFile | OrdoDirectory | string,
  root: Nullable<OrdoDirectory>,
) => {
  if (!root) return null

  const path = typeof child === "string" ? child : child.path

  const parentPathChunks = path.split("/").slice(0, -1).filter(Boolean)

  if (!parentPathChunks.length) {
    return root
  }

  let parent: OrdoDirectory = root

  for (const chunk of parentPathChunks) {
    const found = parent.children.find((child) => child.path === `${parent.path}${chunk}/`)

    if (!found || !isOrdoDirectory(found)) return parent

    parent = found
  }

  return parent
}

export const findOrdoFile = (
  child: OrdoFile | OrdoDirectory | string,
  root: Nullable<OrdoDirectory>,
) => {
  if (!root) return null

  const path = typeof child === "string" ? child : child.path

  const parent = findParent(path, root)

  const found = parent?.children.find((child) => child.path === path)

  if (!found || isOrdoDirectory(found)) return null

  return found
}
