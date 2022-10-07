import type { CaretRange, RootNode } from "../types"

import { getCharIndex } from "@core/editor/get-char-index"
import { CaretRangeDirection } from "../../../core/editor/constants"

export const handleEnter =
  (caretRanges: CaretRange[]) =>
  (root: RootNode): { ranges: CaretRange[]; raw: string } => {
    const ranges = [...caretRanges]

    let raw = root.data.raw

    ranges.reverse().forEach((range) => {
      const line = range.start.line
      const column = range.start.column

      // Update range so that it refers to the beginning of the next line (the new line)
      range.start.line += 1
      range.start.column = 0
      range.end.line = range.start.line
      range.end.column = range.start.column
      range.direction = CaretRangeDirection.LEFT_TO_RIGHT

      const charIndex = getCharIndex({ root, line, column })

      raw = root.data.raw.slice(0, charIndex).concat("\n").concat(root.data.raw.slice(charIndex))
    })

    return { ranges, raw }
  }
