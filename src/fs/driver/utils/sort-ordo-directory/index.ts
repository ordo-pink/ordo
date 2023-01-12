import type { OrdoDirectory } from "$core/types"

import { isOrdoDirectory } from "$fs/driver/utils/is-fs-entity"

export const sortOrdoDirectory = (directory: OrdoDirectory) => {
  directory.children = directory.children.sort((a, b) => {
    if (isOrdoDirectory(a)) {
      sortOrdoDirectory(a)
    }

    if (isOrdoDirectory(b)) {
      sortOrdoDirectory(b)
    }

    if (!isOrdoDirectory(a) && isOrdoDirectory(b)) {
      return 1
    }

    if (isOrdoDirectory(a) && !isOrdoDirectory(b)) {
      return -1
    }

    return a.readableName.localeCompare(b.readableName)
  })

  return directory
}
