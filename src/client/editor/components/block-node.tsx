import React, { Dispatch, SetStateAction } from "react"

import InlineNode from "@client/editor/components/inline-node"
import { LineNode, CaretRange } from "@core/editor/types"

type Props = {
  node: LineNode
  caretRanges: CaretRange[]
  setCaretRanges: Dispatch<SetStateAction<CaretRange[]>>
}

export default function BlockNode({ node, caretRanges, setCaretRanges }: Props) {
  const textNode = node.children[0]
  const isCheckbox = textNode.value.startsWith("(*) ") || textNode.value.startsWith("( ) ")
  const isCurrentLine = caretRanges.some((range) => range.start.line === node.position.start.line)
  const isH1 = textNode.value.startsWith("+++++ ")
  const isH2 = textNode.value.startsWith("++++ ")
  const isH3 = textNode.value.startsWith("+++ ")
  const isH4 = textNode.value.startsWith("++ ")
  const isH5 = textNode.value.startsWith("+ ")

  if (isCheckbox && !isCurrentLine) {
    return (
      <div className="flex space-x-2 items-center">
        <input
          type="checkbox"
          className="w-4 h-4 accent-emerald-700"
          checked={textNode.value.startsWith("(*) ")}
          onChange={(event) => {
            event.preventDefault()
            event.stopPropagation()

            // TODO: Toggle checkbox state
          }}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()

            // TODO: Toggle checkbox state
          }}
        />
        <div>
          {node.children.map((childNode) => (
            <InlineNode
              node={childNode}
              caretRanges={caretRanges}
              setCaretRanges={setCaretRanges}
              key={`${childNode.position?.start.line}-${childNode.position?.start.column}-${childNode.position?.end.line}-${childNode.position?.end.column}`}
            />
          ))}
        </div>
      </div>
    )
  }

  if (isH1) {
    return (
      <h1 className="font-black">
        {node.children.map((childNode) => (
          <InlineNode
            node={childNode}
            caretRanges={caretRanges}
            setCaretRanges={setCaretRanges}
            key={`${childNode.position?.start.line}-${childNode.position?.start.column}-${childNode.position?.end.line}-${childNode.position?.end.column}`}
          />
        ))}
      </h1>
    )
  }

  if (isH2) {
    return (
      <h1 className="font-extrabold">
        {node.children.map((childNode) => (
          <InlineNode
            node={childNode}
            caretRanges={caretRanges}
            setCaretRanges={setCaretRanges}
            key={`${childNode.position?.start.line}-${childNode.position?.start.column}-${childNode.position?.end.line}-${childNode.position?.end.column}`}
          />
        ))}
      </h1>
    )
  }

  if (isH3) {
    return (
      <h1 className="font-bold">
        {node.children.map((childNode) => (
          <InlineNode
            node={childNode}
            caretRanges={caretRanges}
            setCaretRanges={setCaretRanges}
            key={`${childNode.position?.start.line}-${childNode.position?.start.column}-${childNode.position?.end.line}-${childNode.position?.end.column}`}
          />
        ))}
      </h1>
    )
  }

  if (isH4) {
    return (
      <h1 className="font-semibold">
        {node.children.map((childNode) => (
          <InlineNode
            node={childNode}
            caretRanges={caretRanges}
            setCaretRanges={setCaretRanges}
            key={`${childNode.position?.start.line}-${childNode.position?.start.column}-${childNode.position?.end.line}-${childNode.position?.end.column}`}
          />
        ))}
      </h1>
    )
  }

  if (isH5) {
    return (
      <h1 className="italic">
        {node.children.map((childNode) => (
          <InlineNode
            node={childNode}
            caretRanges={caretRanges}
            setCaretRanges={setCaretRanges}
            key={`${childNode.position?.start.line}-${childNode.position?.start.column}-${childNode.position?.end.line}-${childNode.position?.end.column}`}
          />
        ))}
      </h1>
    )
  }

  if (isCheckbox && !isCurrentLine) {
    return (
      <div className="flex space-x-2">
        <input type="checkbox" checked={textNode.value.startsWith("(*) ")} onChange={console.log} />
        <div>
          {node.children.map((childNode) => (
            <InlineNode
              node={childNode}
              caretRanges={caretRanges}
              setCaretRanges={setCaretRanges}
              key={`${childNode.position?.start.line}-${childNode.position?.start.column}-${childNode.position?.end.line}-${childNode.position?.end.column}`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <p className="whitespace-pre">
      {node.children.map((childNode) => (
        <InlineNode
          node={childNode}
          caretRanges={caretRanges}
          setCaretRanges={setCaretRanges}
          key={`${childNode.position?.start.line}-${childNode.position?.start.column}-${childNode.position?.end.line}-${childNode.position?.end.column}`}
        />
      ))}
    </p>
  )
}
