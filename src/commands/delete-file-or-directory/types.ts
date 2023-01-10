import { Nullable, OrdoDirectory, OrdoFile } from "$core/types"

export type AppSelectorExtension = {
  "ordo-command-delete-file-or-directory": DeleteFileOrDirectoryState
}

export type DeleteFileOrDirectoryState = {
  isShown: boolean
  target: Nullable<OrdoFile | OrdoDirectory>
}
