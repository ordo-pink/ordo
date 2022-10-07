import { CaretRangeDirection, TextNodeType } from "../../core/editor/constants"

export type CaretPosition = {
  line: number
  column: number
}

export type CaretRange = {
  start: CaretPosition
  end: CaretPosition
  direction: CaretRangeDirection
}

export type LinePosition = {
  start: CaretPosition & { indend?: boolean }
  end: CaretPosition & { indent?: boolean }
}

export type TextNode = {
  type: TextNodeType
  position: LinePosition
  value: string
}

export type LineNode = {
  type: "line"
  data: { raw: string }
  position: LinePosition
  children: TextNode[]
}

export type Tag = string
export type Link = {
  embed: boolean
  href: string
}
export type Checkbox = {
  checked: boolean
  value: string
}
export type OrdoDate = {
  remind: boolean
  start: Date
  end?: Date
  repeatPattern?: string
}

export type RootNode = {
  type: "root"
  data: {
    raw: string
    tags: Tag[]
    checkboxes: Checkbox[]
    dates: OrdoDate[]
    links: Link[]
  }
  children: LineNode[]
}
