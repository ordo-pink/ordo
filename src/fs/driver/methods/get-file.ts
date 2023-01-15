import { createReadStream, promises } from "fs"
import { join } from "path"

import { Either } from "$core/either"
import { FSDriver } from "$core/types"

import { Exception } from "$fs/constants"

export const getFile =
  (directory: string): FSDriver["getFile"] =>
  async (path) => {
    const absolutePath = join(directory, path)

    const stat = await promises.stat(absolutePath).catch(() => null)

    if (!stat) return Either.left(Exception.NOT_FOUND)

    return Either.right(createReadStream(absolutePath))
  }
