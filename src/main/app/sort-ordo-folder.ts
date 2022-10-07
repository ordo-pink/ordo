import type { OrdoFolder } from "@core/app/types"

import { isFolder } from "@core/app/is-folder"

export const sortOrdoFolder = (folder: OrdoFolder): OrdoFolder => {
  folder.children = folder.children.sort((a, b) => {
    if (isFolder(a)) {
      sortOrdoFolder(a)
    }

    if (isFolder(b)) {
      sortOrdoFolder(b)
    }

    if (!isFolder(a) && isFolder(b)) {
      return 1
    }

    if (isFolder(a) && !isFolder(b)) {
      return -1
    }

    return a.readableName.localeCompare(b.readableName)
  })

  return folder
}
