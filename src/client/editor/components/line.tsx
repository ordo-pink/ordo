import React, { Dispatch, SetStateAction, MouseEvent } from "react"
import BlockNode from "./block-node"
import { CaretRangeDirection } from "../../../core/editor/constants"
import { LineNode, CaretRange } from "@core/editor/types"

type Props = {
  node: LineNode
  caretRanges: CaretRange[]
  setCaretRanges: Dispatch<SetStateAction<CaretRange[]>>
}

export default function Line({ node, caretRanges, setCaretRanges }: Props) {
  const handleLineNumberClick = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const line = node.position.start.line
    const column = 0

    setCaretRanges([
      {
        start: { line, column },
        end: { line, column },
        direction: CaretRangeDirection.LEFT_TO_RIGHT,
      },
    ])
  }

  const handleLineClick = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const line = node.position.start.line
    const column = node.position.end.column - 1

    setCaretRanges([
      {
        start: { line, column },
        end: { line, column },
        direction: CaretRangeDirection.LEFT_TO_RIGHT,
      },
    ])
  }

  return (
    <div className="flex items-center" onClick={handleLineClick}>
      <div
        className="w-12 shrink-0 pr-4 text-right text-neutral-500 font-mono text-sm"
        onClick={handleLineNumberClick}
      >
        {node.position.start.line}
      </div>
      <BlockNode node={node} caretRanges={caretRanges} setCaretRanges={setCaretRanges} />
    </div>
  )
}
