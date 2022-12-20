import { isDirectory } from "$core/guards/is-directory.guard"
import { Nullable, OrdoDirectory, OrdoFile } from "$core/types"

export const findParent = (child: OrdoFile | OrdoDirectory, root: Nullable<OrdoDirectory>) => {
  if (!root) return null

  const parentPathChunks = child.path.split("/").slice(0, -1)

  let parent: OrdoDirectory = root

  for (const chunk of parentPathChunks) {
    const found = parent.children.find((child) => child.path === `${parent.path}/${chunk}`)

    if (!found || !isDirectory(found)) return null

    parent = found
  }

  return parent
}
