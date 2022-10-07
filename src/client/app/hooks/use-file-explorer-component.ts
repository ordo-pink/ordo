import type { OrdoFile, OrdoFolder } from "@core/app/types"

import { isFolder } from "@core/app/is-folder"

import Directory from "@client/app/components/file-explorer/directory"
import File from "@client/app/components/file-explorer/file"

export const useFileExplorerComponent = (item: OrdoFile | OrdoFolder) => {
  return isFolder(item) ? Directory : File
}
