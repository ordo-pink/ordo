import { promises } from "fs"
import { join } from "path"

import { Either } from "$core/either"
import { OrdoDirectoryPath, FSDriver, OrdoDirectory } from "$core/types"

import { Exception } from "$fs/constants"
import { listDirectory } from "$fs/driver/utils/list-directory"

export const createDirectory =
  (directory: string): FSDriver["createDirectory"] =>
  async (path) => {
    const absolutePath = join(directory, path)

    const stat = await promises.stat(absolutePath).catch(() => null)

    if (stat && stat.isDirectory()) return Either.left(Exception.CONFLICT)

    try {
      const recursiveCreationStartPath = await promises.mkdir(absolutePath, { recursive: true })

      if (!recursiveCreationStartPath) {
        return Either.left(Exception.CONFLICT)
      }

      let relativeRecursiveCreationStartPath = recursiveCreationStartPath
        .replace(directory, "")
        .replaceAll("\\", "/")

      if (!relativeRecursiveCreationStartPath.endsWith("/")) {
        relativeRecursiveCreationStartPath = `${relativeRecursiveCreationStartPath}/`
      }

      const listedDirectory = (await listDirectory(
        relativeRecursiveCreationStartPath as OrdoDirectoryPath,
        directory,
      )) as OrdoDirectory

      return Either.right(listedDirectory)
    } catch (e) {
      // TODO: Log error
      return Either.left(Exception.CONFLICT)
    }
  }
