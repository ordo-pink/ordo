import { Nullable } from "@ordo-pink/common-types"
import { IOrdoDirectory, IOrdoFile } from "@ordo-pink/fs-entity"
import { OrdoFSEntity } from "../../core/constants/ordo-fs-entity"

export type FileSystemCommandsState = {
  isCreateModalShown: boolean
  isDeleteModalShown: boolean
  isRenameModalShown: boolean
  entityType: OrdoFSEntity
  parent: Nullable<IOrdoDirectory>
  target: Nullable<IOrdoFile | IOrdoDirectory>
  openOnCreate: boolean
  openOnRename: boolean
}

export type FileSystemExtensionStore = {
  "ordo-command-file-system": FileSystemCommandsState
}
