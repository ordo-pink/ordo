import type { OrdoFSEntity } from "$core/constants/ordo-fs-entity"
import type { Nullable, OrdoDirectory } from "$core/types"

export type AppSelectorExtension = {
  "ordo-command-create-file-or-directory": CreateFileOrDirectoryState
}

export type CreateFileOrDirectoryState = {
  isShown: boolean
  entityType: OrdoFSEntity
  parent: Nullable<OrdoDirectory>
}
