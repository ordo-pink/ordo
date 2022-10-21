import type { OrdoDirectory } from "@core/app/types"

import { isDirectory } from "@client/common/is-directory"

export const sortOrdoDirectory = (directory: OrdoDirectory): OrdoDirectory => {
  directory.children = directory.children.sort((a, b) => {
    if (isDirectory(a)) {
      sortOrdoDirectory(a)
    }

    if (isDirectory(b)) {
      sortOrdoDirectory(b)
    }

    if (!isDirectory(a) && isDirectory(b)) {
      return 1
    }

    if (isDirectory(a) && !isDirectory(b)) {
      return -1
    }

    return a.readableName.localeCompare(b.readableName)
  })

  return directory
}
