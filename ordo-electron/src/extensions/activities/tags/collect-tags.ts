import type { OrdoDirectory } from "@core/app/types"
import type { Nullable } from "@core/types"
import type { TagObject } from "@extensions/activities/tags/types"

import { isDirectory } from "@client/common/is-directory"

export const collectTags = (tree: Nullable<OrdoDirectory>, tags: TagObject[] = []) => {
  if (!tree) return tags

  for (const child of tree.children) {
    if (isDirectory(child)) {
      tags = collectTags(child, tags)
      continue
    }

    if (child.metadata.tags && child.metadata.tags.length) {
      for (const tagName of child.metadata.tags) {
        if (!tags.some((tag) => tag.name === tagName)) {
          tags.push({ name: tagName, files: [] })
        }

        const tag = tags.find((tag) => tag.name === tagName) as TagObject
        tag.files.push(child.readableName)
        tag
      }
    }
  }

  tags.sort((a, b) => b.files.length - a.files.length)

  return tags
}
