import type { OrdoFSEntity } from "$core/constants/ordo-fs-entity"
import type { Nullable, OrdoDirectory, OrdoFile } from "$core/types"

export type FileSystemCommandsState = {
  isCreateModalShown: boolean
  isDeleteModalShown: boolean
  entityType: OrdoFSEntity
  parent: Nullable<OrdoDirectory>
  target: Nullable<OrdoFile | OrdoDirectory>
}

export type FileSystemExtensionStore = {
  "ordo-command-file-system": FileSystemCommandsState
}
