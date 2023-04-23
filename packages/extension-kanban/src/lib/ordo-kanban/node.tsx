import { OrdoDirectoryPath } from "@ordo-pink/common-types"
import {
  Spread,
  SerializedTextNode,
  DecoratorNode,
  NodeKey,
  LexicalNode,
  ElementNode,
  ParagraphNode,
} from "lexical"
import { ReactNode } from "react"
import EditorKanban from "../components/editor-kanban"

// TODO: Extract this to types
export type SerializedOrdoNode<
  T extends Record<string, unknown>,
  M extends Record<string, unknown>,
> = Spread<
  T & {
    ordoMetadata?: M
  },
  SerializedTextNode
>

export type SerializedOrdoKanbanNode = SerializedOrdoNode<
  { directory: OrdoDirectoryPath },
  { kanbans: OrdoDirectoryPath[] }
>

export class OrdoKanbanNode extends DecoratorNode<ReactNode> {
  __directory: OrdoDirectoryPath

  static override getType(): string {
    return "ordo-kanban"
  }

  static override clone(node: OrdoKanbanNode): OrdoKanbanNode {
    return new OrdoKanbanNode(node.__directory, node.__key)
  }

  static override importJSON(serializedNode: SerializedOrdoKanbanNode): OrdoKanbanNode {
    const node = $createOrdoKanbanNode(serializedNode.directory)

    node.setDirectory(serializedNode.directory)
    node["setFormat"](serializedNode.format)
    node["setDetail"](serializedNode.detail)
    node["setMode"](serializedNode.mode)
    node["setStyle"](serializedNode.style)

    return node
  }

  constructor(directory: OrdoDirectoryPath, key?: NodeKey) {
    super(key)
    this.__directory = directory
  }

  canBeEmpty(): false {
    return false
  }

  override isInline(): boolean {
    return false
  }

  override createDOM(): HTMLElement {
    return document.createElement("div")
  }

  override updateDOM(): false {
    return false
  }

  getDirectory(): OrdoDirectoryPath {
    return this.__directory
  }

  setDirectory(directory: OrdoDirectoryPath) {
    const writable = this.getWritable()
    writable.__directory = directory
  }

  override createParentElementNode(): ElementNode {
    return new ParagraphNode()
  }

  override decorate(): ReactNode {
    return <EditorKanban node={this} />
  }

  override exportJSON(): SerializedOrdoKanbanNode {
    return {
      detail: 0,
      format: 0,
      mode: "token",
      style: "",
      directory: this.__directory,
      text: this["__text"],
      ordoMetadata: { kanbans: [this.__directory] },
      type: "ordo-kanban",
      version: 1,
    }
  }
}

export function $createOrdoKanbanNode(directory: OrdoDirectoryPath): OrdoKanbanNode {
  return new OrdoKanbanNode(directory)
}

export function $isOrdoKanbanNode(node: LexicalNode): boolean {
  return node instanceof OrdoKanbanNode
}
