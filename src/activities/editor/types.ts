import type editor from "$activities/editor"

import { ExtensionState, Nullable, OrdoFile } from "$core/types"

export type EditorState = {
  currentFile: Nullable<OrdoFile>
}

export type EditorActivityState = ExtensionState<typeof editor>

export type EditorMetadata = {
  recentFiles: string[]
  expandedDirectories: string[]
}
