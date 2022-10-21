import { RootNode } from "@client/editor/types"

type Params = {
  root: RootNode
  line: number
  column: number
}

/**
 * Find the offset of a given char from the beginning of the document.
 */
export const getCharIndex = ({ root, line, column }: Params) => {
  let offset = column

  for (let i = 0; i < line - 1; i++) {
    if (!root.children[i]) continue
    offset += root.children[i].data.raw.length + 1
  }

  return offset
}
