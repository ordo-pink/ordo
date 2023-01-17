import { promises } from "fs"

import { Either } from "$core/either"
import { FSDriver, OrdoDirectory } from "$core/types"
import { OrdoDirectoryPath } from "$core/types"

import { Exception } from "$fs/constants"
import { getNormalizedAbsolutePath } from "$fs/driver/utils/get-normalized-absolute-path"
import { listDirectory } from "$fs/driver/utils/list-directory"
import { createDirectory } from "./create-directory"

export const getDirectory =
  (directory: string): FSDriver["getDirectory"] =>
  async (path) => {
    const absolutePath = getNormalizedAbsolutePath(path, directory)
    if (path === ("" as OrdoDirectoryPath)) {
      const stat = await promises.stat(absolutePath).catch(() => null)

      if (!stat || !stat.isDirectory()) {
        await createDirectory(directory)("" as OrdoDirectoryPath)
      }
    }

    const stat = await promises.stat(absolutePath).catch(() => null)

    if (!stat) return Either.left(Exception.NOT_FOUND)

    const dir = await listDirectory(absolutePath, directory)

    return Either.right(dir as OrdoDirectory)
  }
