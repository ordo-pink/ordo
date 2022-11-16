import { Color } from "$core/constants/color"
import { OrdoFile } from "$core/types"

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

// TODO Return this from the editor parser
export type OrdoIsmFile = OrdoFile<{
  color: Color
  icon?: string // Emoji, image path, or image url
  cover?: string // Image path or image url

  // TODO Extract this info since it doesn't make sense to store it inside the file (MAYBEEEEEE)
  tags: string[]
  dates: OrdoIsmFileDate[]
  links: OrdoIsmLink[]
  checkboxes: OrdoIsmCheckbox[]
}>
