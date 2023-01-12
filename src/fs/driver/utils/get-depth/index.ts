import { OrdoDirectoryPath, OrdoFilePath } from "$core/types"

export const getDepth = (path: OrdoFilePath | OrdoDirectoryPath): number =>
  path.split("/").filter(Boolean).length
