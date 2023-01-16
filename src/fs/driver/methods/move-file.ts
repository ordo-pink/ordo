import { promises } from "fs"
import { join } from "path"

import { Either } from "$core/either"
import { FSDriver, OrdoDirectory } from "$core/types"

import { Exception } from "$fs/constants"
import { createDirectory } from "$fs/driver/methods/create-directory"
import { createOrdoFile } from "$fs/driver/utils/create-ordo-file"
import { getDepth } from "$fs/driver/utils/get-depth"
import { getNormalizedAbsolutePath } from "$fs/driver/utils/get-normalized-absolute-path"
import { getParentPath } from "$fs/driver/utils/get-parent-path"
import { listDirectory } from "$fs/driver/utils/list-directory"

export const moveFile =
  (directory: string): FSDriver["moveFile"] =>
  async (oldPath, newPath) => {
    const oldAbsolutePath = join(directory, oldPath)
    const newAbsolutePath = join(directory, newPath)

    const oldStat = await promises.stat(oldAbsolutePath).catch(() => null)
    const newStat = await promises.stat(newAbsolutePath).catch(() => null)

    if (!oldStat || !oldStat.isFile()) {
      return Either.left(Exception.NOT_FOUND)
    }

    if (newStat && newStat.isFile()) {
      return Either.left(Exception.CONFLICT)
    }

    const parentPath = getParentPath(newPath)

    const eitherParent = await createDirectory(directory)(parentPath)

    await promises.rename(oldAbsolutePath, newAbsolutePath)

    const { size, atime, mtime, birthtime } = await promises.stat(newAbsolutePath)
    const depth = getDepth(newPath)
    const [createdAt, updatedAt, accessedAt] = [birthtime, mtime, atime]

    const ordoFile = createOrdoFile({
      path: newPath,
      accessedAt,
      createdAt,
      depth,
      size,
      updatedAt,
    })

    const parent = eitherParent.getOrElse(() => null)

    if (!parent) return Either.right(ordoFile)

    const absoluteParentPath = getNormalizedAbsolutePath(parent.path, directory)

    const createdDirectory = (await listDirectory(absoluteParentPath, directory)) as OrdoDirectory

    return Either.right(createdDirectory)
  }
