import { Nullable, IOrdoFile, OrdoFilePath, OrdoDirectoryPath } from "@ordo-pink/core"
import type editor from "$activities/editor"

import { ExtensionState } from "$core/types"

export type EditorState = {
  currentFile: Nullable<IOrdoFile>
}

export type EditorActivityState = ExtensionState<typeof editor>

export type EditorPersistedState = {
  recentFiles: OrdoFilePath[]
  expandedDirectories: OrdoDirectoryPath[]
}
