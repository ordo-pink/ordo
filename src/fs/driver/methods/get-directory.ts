import { promises } from "fs"
import { join } from "path"

import { Either } from "$core/either"
import { FSDriver, OrdoDirectory } from "$core/types"

import { Exception } from "$fs/constants"
import { listDirectory } from "$fs/driver/utils/list-directory"

export const getDirectory =
  (directory: string): FSDriver["getDirectory"] =>
  async (path) => {
    // TODO: Extract path normalization to a util function
    const absolutePath = join(directory, path).replaceAll("\\", "/")

    const stat = await promises.stat(absolutePath).catch(() => null)

    if (!stat) return Either.left(Exception.NOT_FOUND)

    const dir = await listDirectory(absolutePath, directory)

    return Either.right(dir as OrdoDirectory)
  }
