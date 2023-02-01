import { promises } from "fs"
import { join } from "path"

import { Either } from "$core/either"
import { FSDriver } from "$core/types"

import { Exception } from "$fs/constants"
import { createOrdoDirectory } from "$fs/driver/utils/create-ordo-directory"
import { getDepth } from "$fs/driver/utils/get-depth"

export const removeDirectory =
  (directory: string): FSDriver["removeDirectory"] =>
  async (path) => {
    const absolutePath = join(directory, path)

    const stat = await promises.stat(absolutePath).catch(() => null)

    if (!stat || !stat.isDirectory()) {
      return Either.left(Exception.NOT_FOUND)
    }

    const { atime, mtime, birthtime } = stat
    const depth = getDepth(path)
    const [createdAt, updatedAt, accessedAt] = [birthtime, mtime, atime]

    const ordoDirectory = createOrdoDirectory({ path, accessedAt, createdAt, depth, updatedAt })

    await promises.rm(absolutePath, { recursive: true, force: true })

    return Either.right(ordoDirectory)
  }
