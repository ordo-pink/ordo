import { Color } from "@core/colors"
import { Nullable } from "@core/types"

import { Language } from "@core/locales"
import { Theme } from "@core/theme"
import { RootNode } from "@core/editor/types"

export type OrdoPathLike = string
export type OrdoPath = OrdoPathLike
export type OrdoRelativePath = OrdoPathLike
export type OrdoFileExtension = `.${string}`

export type OrdoAppEvent<T = unknown> = {
  type: string
  payload: T
}

export interface OrdoFSElement {
  path: OrdoPath
  relativePath: OrdoRelativePath
  readableName: string
  depth: number
  createdAt: Date
  updatedAt: Date
  accessedAt: Date
}

export interface OrdoFile<TMetadata extends Record<string, unknown> = Record<string, unknown>>
  extends OrdoFSElement {
  extension: Nullable<OrdoFileExtension>
  metadata: TMetadata & RootNode["data"] & { color: Color }
  size: number
}

export interface OrdoFolder<TMetadata extends Record<string, unknown> = Record<string, unknown>>
  extends OrdoFSElement {
  children: (OrdoFile | OrdoFolder)[]
  metadata: TMetadata & { color: Color }
}

/**
 * Settings applied on each device. Controlled by user.
 */
export type UserSettings = {
  "appearance.theme": Theme
  "appearance.language": Language
  "project.personal.directory": string
  // TODO: 74
  // "graph.show-folders": boolean
  // "graph.show-links": boolean
  // "graph.show-tags": boolean
  // "graph.show-dates": boolean
  // "graph.show-checkboxes": boolean
  // "editor.show-line-numbers": boolean
  // "editor.auto-close-brackets": boolean
  // "editor.auto-close-quotes": boolean
  // "editor.auto-close-braces": boolean
  // "editor.auto-close-curly-braces": boolean
  // "editor.empty-selection-line-to-clipboard": boolean
  "files.confirm-delete": boolean
  "files.confirm-move": boolean
  "editor.font-size": number
  // "files.confirm-nested-create": boolean
}

/**
 * Settings for each device. Controlled internally.
 */
export type LocalSettings = {
  "window.position.x": number
  "window.position.y": number
  "window.width": number
  "window.height": number
  "side-bar.width": number
  "file-explorer.expanded-folders": string[]
  "app.separator": string
  // "project.external.directories": string[]
}
