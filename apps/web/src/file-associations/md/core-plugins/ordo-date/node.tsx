import { Nullable } from "@ordo-pink/common-types"
import { Spread, SerializedTextNode, DecoratorNode, NodeKey, LexicalNode } from "lexical"
import { $applyNodeReplacement } from "lexical"
import { ReactNode } from "react"
import { DateComponent } from "./component"

type SerializedOrdoDateNode = Spread<
  {
    type: "ordo-date"
    version: 1
    startDate: Date
    endDate: Nullable<Date>
  },
  SerializedTextNode
>

export class OrdoDateNode extends DecoratorNode<ReactNode> {
  __startDate: Date
  __endDate: Nullable<Date>

  static getType(): string {
    return "ordo-date"
  }

  static clone(node: OrdoDateNode): OrdoDateNode {
    return new OrdoDateNode(node.__startDate, node.__endDate, node.__key)
  }

  static importJSON(serializedNode: SerializedOrdoDateNode): OrdoDateNode {
    const node = $createOrdoDateNode(serializedNode.startDate, serializedNode.endDate)

    node.setFormat(serializedNode.format)
    node.setDetail(serializedNode.detail)
    node.setMode(serializedNode.mode)
    node.setStyle(serializedNode.style)

    return node
  }

  constructor(startDate: Date, endDate?: Nullable<Date>, key?: NodeKey) {
    super(key)
    this.__startDate = startDate
    this.__endDate = endDate ?? null
  }

  getTextContent(): string {
    if (this.__endDate) {
      return `${this.__startDate.toISOString()}>>>${this.__endDate.toISOString()}`
    }

    return this.__startDate.toISOString()
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
    return this.__startDate
  }

  setDate(startDate: Date, endDate?: Date) {
    const writable = this.getWritable()
    writable.__startDate = startDate
    writable.__text = startDate.toISOString()

    if (endDate) {
      writable.__endDate = endDate
      writable.__text = `${startDate.toISOString()}>>>${endDate.toISOString()}`
    }
  }

  decorate(): ReactNode {
    return (
      <DateComponent
        nodeKey={this.__key}
        startDate={this.__startDate}
        endDate={this.__endDate}
      />
    )
  }

  exportJSON(): SerializedOrdoDateNode {
    return {
      detail: 0,
      format: 0,
      mode: "token",
      style: "",
      startDate: this.__startDate,
      endDate: this.__endDate,
      text: this.__text,
      type: "ordo-date",
      version: 1,
    }
  }
}

export function $createOrdoDateNode(startDate: Date, endDate: Nullable<Date>): OrdoDateNode {
  return $applyNodeReplacement(new OrdoDateNode(startDate, endDate))
}

export function $isOrdoDateNode(node: LexicalNode): boolean {
  return node instanceof OrdoDateNode
}
