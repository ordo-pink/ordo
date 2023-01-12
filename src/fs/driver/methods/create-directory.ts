import { promises } from "fs"
import { join } from "path"

import { Either } from "$core/either"
import { DirectoryPath, FSDriver, OrdoDirectory } from "$core/types"

import { Exception } from "$fs/constants"
import { getParentPath } from "$fs/driver/utils/get-parent-path"
import { listDirectory } from "$fs/driver/utils/list-directory"

export const createDirectory =
  (directory: DirectoryPath): FSDriver["createDirectory"] =>
  async (path) => {
    const absolutePath = join(directory, path)

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

      const parentPath = getParentPath(relativeRecursiveCreationStartPath as DirectoryPath)

      const listedDirectory = (await listDirectory(parentPath, directory)) as OrdoDirectory

      return Either.right(listedDirectory)
    } catch (_) {
      // TODO: Add logging. Replace with Exception.UNKNOWN
      return Either.left(Exception.CONFLICT)
    }
  }
