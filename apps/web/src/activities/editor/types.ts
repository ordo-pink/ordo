import { Nullable } from "@ordo-pink/common-types"
import { ExtensionState } from "@ordo-pink/extensions"
import { IOrdoFile, OrdoFilePath } from "@ordo-pink/fs-entity"

export type EditorState = {
  currentFile: Nullable<IOrdoFile>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EditorActivityState = ExtensionState<any>

export type EditorPersistedState = {
  recentFiles: OrdoFilePath[]
}
