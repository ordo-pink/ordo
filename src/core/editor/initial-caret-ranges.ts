import { CaretRangeDirection } from "@core/editor/constants"

export const initialCaretRanges = [
  {
    start: { line: 1, column: 0 },
    end: { line: 1, column: 0 },
    direction: CaretRangeDirection.LEFT_TO_RIGHT,
  },
]
