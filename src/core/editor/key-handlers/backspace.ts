import type { CaretRange, RootNode } from "../types"

import { getCharIndex } from "@core/editor/get-char-index"
import { CaretRangeDirection } from "../../../core/editor/constants"

export const handleBackspace =
  (caretRanges: CaretRange[]) =>
  (root: RootNode): { ranges: CaretRange[]; raw: string } => {
    const ranges = [...caretRanges]

    let raw = root.data.raw

    ranges.reverse().forEach((range) => {
      const line = range.start.line
      const column = range.start.column

      const isFirstLine = line === 1
      const isLineStart = column === 0

      if (isLineStart) {
        if (isFirstLine) return

        const previousLineIndex = line - 2
        const previousLine = root.children[previousLineIndex]

        range.start.line = previousLine.position.start.line
        range.start.column = previousLine.position.end.column - 1
      } else {
        // Move caret one character left
        range.start.column -= 1
      }

      range.end.line = range.start.line
      range.end.column = range.start.column
      range.direction = CaretRangeDirection.LEFT_TO_RIGHT

      const charIndex = getCharIndex({ root, line, column })

      raw = root.data.raw.slice(0, charIndex - 1).concat(root.data.raw.slice(charIndex))
    })

    return { ranges, raw }
  }
