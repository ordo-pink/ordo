import { isDirectory } from "@core/app/is-directory"
import { OrdoDirectory } from "@core/app/types"
import { Nullable } from "@core/types"
import { TagObject } from "./types"

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
