import type { CaretRange, RootNode } from "../types"

import { getCharIndex } from "@core/editor/get-char-index"

export const handleDelete =
  (caretRanges: CaretRange[]) =>
  (root: RootNode): { ranges: CaretRange[]; raw: string } => {
    const ranges = [...caretRanges]

    let raw = root.data.raw

    ranges.reverse().forEach((range) => {
      const line = range.start.line
      const column = range.start.column
      const lineIndex = line - 1
      const lineNode = root.children[lineIndex]

      const isLastLine = line === root.children.length
      const isLastColumn = column === lineNode.position.end.column - 1

      if (isLastColumn) {
        if (isLastLine) return

        const charIndex = getCharIndex({ root, line, column })

        raw = root.data.raw.slice(0, charIndex).concat(root.data.raw.slice(charIndex + 1))
      } else {
        const charIndex = getCharIndex({ root, line, column })

        raw = root.data.raw.slice(0, charIndex).concat(root.data.raw.slice(charIndex + 1))
      }
    })

    return { ranges, raw }
  }
