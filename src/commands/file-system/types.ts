import { Nullable, IOrdoDirectory, IOrdoFile } from "@ordo-pink/core"
import type { OrdoFSEntity } from "$core/constants/ordo-fs-entity"

export type FileSystemCommandsState = {
  isCreateModalShown: boolean
  isDeleteModalShown: boolean
  entityType: OrdoFSEntity
  parent: Nullable<IOrdoDirectory>
  target: Nullable<IOrdoFile | IOrdoDirectory>
}

export type FileSystemExtensionStore = {
  "ordo-command-file-system": FileSystemCommandsState
}
