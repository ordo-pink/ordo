import { Nullable } from "@ordo-pink/common-types"
import { Spread, SerializedTextNode, DecoratorNode, NodeKey, LexicalNode } from "lexical"
import { ReactNode } from "react"
import { DateComponent } from "./component"

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

export type SerializedOrdoDateNode = SerializedOrdoNode<
  { startDate: Date; endDate: Nullable<Date> },
  { dates: Array<{ start: Date; end: Nullable<Date> }> }
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

    node.setDate(serializedNode.startDate, serializedNode.endDate)
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

  setDate(startDate: Date, endDate?: Nullable<Date>) {
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
      ordoMetadata: { dates: [{ start: this.__startDate, end: this.__endDate }] },
      type: "ordo-date",
      version: 1,
    }
  }
}

export function $createOrdoDateNode(startDate: Date, endDate: Nullable<Date>): OrdoDateNode {
  return new OrdoDateNode(startDate, endDate)
}

export function $isOrdoDateNode(node: LexicalNode): boolean {
  return node instanceof OrdoDateNode
}
