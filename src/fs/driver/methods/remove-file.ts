import { promises } from "fs"
import { join } from "path"

import { Either } from "$core/either"
import { FSDriver } from "$core/types"

import { Exception } from "$fs/constants"
import { createOrdoFile } from "$fs/driver/utils/create-ordo-file"
import { getDepth } from "$fs/driver/utils/get-depth"

export const removeFile =
  (directory: string): FSDriver["removeFile"] =>
  async (path) => {
    const absolutePath = join(directory, path)

    const stat = await promises.stat(absolutePath).catch(() => null)

    if (!stat || !stat.isFile()) {
      return Either.left(Exception.NOT_FOUND)
    }

    const { size, atime, mtime, birthtime } = stat
    const depth = getDepth(path)
    const [createdAt, updatedAt, accessedAt] = [birthtime, mtime, atime]

    const ordoFile = createOrdoFile({ path, accessedAt, createdAt, depth, size, updatedAt })

    await promises.unlink(absolutePath)

    return Either.right(ordoFile)
  }
