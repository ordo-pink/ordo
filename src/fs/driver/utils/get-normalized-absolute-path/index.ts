import { join } from "path"

import { OrdoDirectoryPath, OrdoFilePath } from "$core/types"

export const getNormalizedAbsolutePath = (path: OrdoFilePath | OrdoDirectoryPath, root: string) =>
  join(root, path).replaceAll("\\", "/")
