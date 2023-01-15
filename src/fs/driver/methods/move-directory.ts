import { promises } from "fs"
import { join } from "path"

import { Either } from "$core/either"
import { FSDriver, OrdoDirectory } from "$core/types"

import { Exception } from "$fs/constants"
import { createDirectory } from "$fs/driver/methods/create-directory"
import { createOrdoDirectory } from "$fs/driver/utils/create-ordo-directory"
import { getDepth } from "$fs/driver/utils/get-depth"
import { getParentPath } from "$fs/driver/utils/get-parent-path"

export const moveDirectory =
  (directory: string): FSDriver["moveDirectory"] =>
  async (oldPath, newPath) => {
    const oldAbsolutePath = join(directory, oldPath)
    const newAbsolutePath = join(directory, newPath)

    const oldStat = await promises.stat(oldAbsolutePath).catch(() => null)
    const newStat = await promises.stat(newAbsolutePath).catch(() => null)

    if (!oldStat || !oldStat.isDirectory()) {
      return Either.left(Exception.NOT_FOUND)
    }

    if (newStat) {
      return Either.left(Exception.CONFLICT)
    }

    const parentPath = getParentPath(newPath)

    const eitherParent = await createDirectory(directory)(parentPath)

    await promises.rename(oldAbsolutePath, newAbsolutePath)

    const { atime, mtime, birthtime } = await promises.stat(newAbsolutePath)
    const depth = getDepth(newPath)
    const [createdAt, updatedAt, accessedAt] = [birthtime, mtime, atime]

    const ordoDirectory = createOrdoDirectory({
      path: newPath,
      accessedAt,
      createdAt,
      depth,
      updatedAt,
    })

    return eitherParent.fold(
      () => Either.right<OrdoDirectory, Exception.CONFLICT | Exception.NOT_FOUND>(ordoDirectory),
      (parent) => {
        parent.children.push(ordoDirectory)

        return Either.right<OrdoDirectory, Exception.CONFLICT | Exception.NOT_FOUND>(parent)
      },
    )
  }
