import { DirectoryPath, FilePath } from "$core/types"

export const getDepth = (path: FilePath | DirectoryPath): number =>
  path.split("/").filter(Boolean).length
