import type { CaretRange, RootNode } from "@client/editor/types"

import { getCharIndex } from "@client/editor/get-char-index"
import { CaretRangeDirection } from "@client/editor/constants"

export const handleChar =
  (caretRanges: CaretRange[], char: string) =>
  (root: RootNode): { ranges: CaretRange[]; raw: string } => {
    const ranges = [...caretRanges]

    let raw = root.data.raw

    ranges.reverse().forEach((range) => {
      const line = range.start.line
      const column = range.start.column

      const charIndex = getCharIndex({ root, line, column })

      raw = root.data.raw.slice(0, charIndex).concat(char).concat(root.data.raw.slice(charIndex))

      range.start.column += 1
      range.end.column = range.start.column
      range.direction = CaretRangeDirection.LEFT_TO_RIGHT
    })

    return { ranges, raw }
  }
