import { TextNode, CaretRange } from "@core/editor/types"
import Switch from "@core/utils/switch"
import React, { useState, useEffect, Dispatch, SetStateAction } from "react"
import Caret from "./caret"
import Char from "./char"

type Props = {
  node: TextNode
  caretRanges: CaretRange[]
  setCaretRanges: Dispatch<SetStateAction<CaretRange[]>>
}

export default function InlineNode({ node, caretRanges, setCaretRanges }: Props) {
  const [hasCaretAtLineStart, setHasCaretAtLineStart] = useState(false)
  const isCheckbox = node.value.startsWith("(*) ") || node.value.startsWith("( ) ")
  const isCurrentLine = caretRanges.some((range) => range.start.line === node.position.start.line)
  const isH1 = node.value.startsWith("+++++ ")
  const isH2 = node.value.startsWith("++++ ")
  const isH3 = node.value.startsWith("+++ ")
  const isH4 = node.value.startsWith("++ ")
  const isH5 = node.value.startsWith("+ ")

  useEffect(() => {
    const hasCaretAtStart = caretRanges.some(
      (range) =>
        range.start.line === node.position?.start.line &&
        range.start.column === node.position?.start.column
    )

    setHasCaretAtLineStart(hasCaretAtStart)

    return () => {
      setHasCaretAtLineStart(false)
    }
  }, [caretRanges, node])

  const chars = Switch.of(node.value)
    .case(
      () => isCheckbox && !isCurrentLine,
      () => node.value.slice(4)
    )
    .case(
      () => isH1 && !isCurrentLine,
      () => node.value.slice(6)
    )
    .case(
      () => isH2 && !isCurrentLine,
      () => node.value.slice(5)
    )
    .case(
      () => isH3 && !isCurrentLine,
      () => node.value.slice(4)
    )
    .case(
      () => isH4 && !isCurrentLine,
      () => node.value.slice(3)
    )
    .case(
      () => isH5 && !isCurrentLine,
      () => node.value.slice(2)
    )
    .default(() => node.value)

  if (!node.value) {
    return (
      <span>
        {hasCaretAtLineStart && <Caret />}
        <br />
      </span>
    )
  }

  return (
    <span>
      {hasCaretAtLineStart && <Caret />}
      {chars()
        .split("")
        .map((char, index) => (
          <Char
            key={`${node.position?.start.line}-${node.position?.start.column}-${index + 1}`}
            char={char}
            index={index}
            caretRanges={caretRanges}
            setCaretRanges={setCaretRanges}
            node={node}
          />
        ))}
    </span>
  )
}
