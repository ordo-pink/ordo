import { Color } from "$core/constants/color"
import { Nullable, OrdoFile } from "$core/types"

export type EditorState = {
  currentFile: Nullable<OrdoFile>
  currentFileRaw?: string
}

export type OrdoIsmFileDate = {
  remind: boolean
  start: Date
  end?: Date
  repeatPattern?: string
}

export type OrdoIsmLink = {
  embedded: boolean
  href: string
  readableName: string
}

export type OrdoIsmCheckbox = {
  checked: boolean
  line: number
}

export type OrdoIsmFile = OrdoFile<{
  color: Color
  icon?: string // Emoji, image path, or image url
  cover?: string // Image path or image url
  tags: string[]
  dates: OrdoIsmFileDate[]
  links: OrdoIsmLink[]
  checkboxes: OrdoIsmCheckbox[]
}>
