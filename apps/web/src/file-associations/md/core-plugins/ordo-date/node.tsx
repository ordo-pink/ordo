import { Spread, SerializedTextNode, DecoratorNode, NodeKey, LexicalNode } from "lexical"
import { $applyNodeReplacement } from "lexical"
import { ReactNode } from "react"
import { DateComponent } from "./component"

type SerializedOrdoDateNode = Spread<
  {
    type: "ordo-date"
    version: 1
    date: Date
  },
  SerializedTextNode
>

export class OrdoDateNode extends DecoratorNode<ReactNode> {
  __date: Date

  static getType(): string {
    return "ordo-date"
  }

  static clone(node: OrdoDateNode): OrdoDateNode {
    return new OrdoDateNode(node.__date, node.__key)
  }

  static importJSON(serializedNode: SerializedOrdoDateNode): OrdoDateNode {
    const node = $createOrdoDateNode(serializedNode.date)

    node.setFormat(serializedNode.format)
    node.setDetail(serializedNode.detail)
    node.setMode(serializedNode.mode)
    node.setStyle(serializedNode.style)

    return node
  }

  constructor(date: Date, key?: NodeKey) {
    super(key)
    this.__date = date
    this.__text = date.toISOString()
  }

  getTextContent(): string {
    return this.__date.toISOString()
  }

  canInsertTextBefore(): false {
    return false
  }

  canInsertTextAfter(): false {
    return false
  }

  canBeEmpty(): false {
    return false
  }

  isInline(): boolean {
    return true
  }

  createDOM(): HTMLElement {
    return document.createElement("span")
  }

  updateDOM(): false {
    return false
  }

  getDate(): Date {
    return this.__date
  }

  setDate(date: Date) {
    const writable = this.getWritable()
    writable.__date = date
    writable.__text = date.toISOString()
  }

  decorate(): ReactNode {
    return (
      <DateComponent
        nodeKey={this.__key}
        date={this.__date}
      />
    )
  }

  exportJSON(): SerializedOrdoDateNode {
    return {
      detail: 0,
      format: 0,
      mode: "token",
      style: "",
      date: this.__date,
      text: this.__text,
      type: "ordo-date",
      version: 1,
    }
  }
}

export function $createOrdoDateNode(date: Date): OrdoDateNode {
  return $applyNodeReplacement(new OrdoDateNode(date))
}

export function $isOrdoDateNode(node: LexicalNode): boolean {
  return node instanceof OrdoDateNode
}
