import type { OrdoFile, OrdoDirectory } from "@core/app/types"

import { isDirectory } from "@client/common/is-directory"

import Directory from "@client/file-explorer/components/directory"
import File from "@client/file-explorer/components/file"

export const useFileExplorerComponent = (item: OrdoFile | OrdoDirectory) => {
  return isDirectory(item) ? Directory : File
}
