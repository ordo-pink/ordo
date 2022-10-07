import React, { useState, useEffect, Dispatch, SetStateAction, MouseEvent } from "react"
import { CaretRangeDirection } from "../../../core/editor/constants"
import { CaretRange, TextNode } from "@core/editor/types"
import Caret from "./caret"

type Props = {
  node: TextNode
  caretRanges: CaretRange[]
  index: number
  char: string
  setCaretRanges: Dispatch<SetStateAction<CaretRange[]>>
}

export default function Column({ node, caretRanges, index, char, setCaretRanges }: Props) {
  const [hasCaretOnChar, setHasCaretOnChar] = useState(false)

  useEffect(() => {
    const hasCaret = caretRanges.some(
      (range) =>
        range.start.line === node.position?.start.line &&
        range.start.column === node.position.start.column + index + 1
    )

    setHasCaretOnChar(hasCaret)
  }, [caretRanges, index, node])

  const handleClick = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    setCaretRanges([
      {
        start: { line: node.position.start.line, column: index + 1 },
        end: { line: node.position.start.line, column: index + 1 },
        direction: CaretRangeDirection.LEFT_TO_RIGHT,
      },
    ])
  }

  return (
    <span onClick={handleClick}>
      {char}
      {hasCaretOnChar && <Caret />}
    </span>
  )
}
