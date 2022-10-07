import { TextNodeType } from "@core/editor/constants"
import { LineNode, RootNode } from "@core/editor/types"

export const createRoot = (raw: string): RootNode => {
  const root: RootNode = {
    type: "root",
    data: {
      raw,
      tags: [],
      checkboxes: [],
      dates: [],
      links: [],
    },
    children: [],
  }

  const lines = raw.split("\n")

  let offset = 0

  lines.forEach((line, index) => {
    const start = { line: index + 1, column: 0, offset }

    offset += line.length

    const end = { line: index + 1, column: line.length + 1, offset }

    const lineNode: LineNode = {
      type: "line",
      data: { raw: line },
      position: { start, end },
      children: [{ type: TextNodeType.TEXT, position: { start, end }, value: line }],
    }

    root.children.push(lineNode)
  })

  return root
}
