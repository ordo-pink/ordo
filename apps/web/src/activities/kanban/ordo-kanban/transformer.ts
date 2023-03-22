import { TextMatchTransformer } from "@lexical/markdown"
import { OrdoDirectoryPath } from "@ordo-pink/fs-entity"
import { OrdoKanbanNode, $isOrdoKanbanNode, $createOrdoKanbanNode } from "./node"

const rx = /\(\(\(Kanban::(\/.*\/)\)\)\)/

export const ORDO_KANBAN_TRANSFORMER: TextMatchTransformer = {
  dependencies: [OrdoKanbanNode],
  export: (node) => {
    if (!$isOrdoKanbanNode(node)) {
      return null
    }

    const currentNode = node as OrdoKanbanNode

    return `(((Kanban::${currentNode.getDirectory()})))`
  },
  importRegExp: rx,
  regExp: rx,
  replace: (textNode, match) => {
    const directoryPath = match[1]

    const dateNode = $createOrdoKanbanNode(directoryPath as OrdoDirectoryPath)

    textNode.replace(dateNode)
  },
  trigger: " ",
  type: "text-match",
}
