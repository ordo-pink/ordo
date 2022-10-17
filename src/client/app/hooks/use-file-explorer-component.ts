import type { OrdoFile, OrdoDirectory } from "@core/app/types"

import { isDirectory } from "@core/app/is-directory"

import Directory from "@client/app/components/file-explorer/directory"
import File from "@client/app/components/file-explorer/file"

export const useFileExplorerComponent = (item: OrdoFile | OrdoDirectory) => {
  return isDirectory(item) ? Directory : File
}
