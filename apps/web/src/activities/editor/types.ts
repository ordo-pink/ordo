import { Nullable } from "@ordo-pink/common-types"
import { IOrdoFile, OrdoFilePath, OrdoDirectoryPath } from "@ordo-pink/fs-entity"
import type editor from "."
import { ExtensionState } from "../../core/types"

export type EditorState = {
  currentFile: Nullable<IOrdoFile>
}

export type EditorActivityState = ExtensionState<typeof editor>

export type EditorPersistedState = {
  recentFiles: OrdoFilePath[]
  expandedDirectories: OrdoDirectoryPath[]
}
