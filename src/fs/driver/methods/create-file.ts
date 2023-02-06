import { createWriteStream, promises } from "fs"
import { join } from "path"
import { Either } from "$core/either"
import { charset } from "mime-types"

import { FSDriver, OrdoDirectory } from "$core/types"

import { Exception } from "$fs/constants"
import { createDirectory } from "$fs/driver/methods/create-directory"
import { createOrdoFile } from "$fs/driver/utils/create-ordo-file"
import { getDepth } from "$fs/driver/utils/get-depth"
import { getFileExtension } from "$fs/driver/utils/get-file-extension"
import { getNormalizedAbsolutePath } from "$fs/driver/utils/get-normalized-absolute-path"
import { getParentPath } from "$fs/driver/utils/get-parent-path"
import { listDirectory } from "$fs/driver/utils/list-directory"
import { promiseWriteStream } from "$fs/driver/utils/promise-write-stream"

export const createFile =
  (directory: string): FSDriver["createFile"] =>
  async (path, contentStream?) => {
    const absolutePath = join(directory, path)

    const stat = await promises.stat(absolutePath).catch(() => null)

    if (stat && stat.isFile()) {
      return Either.left(Exception.CONFLICT)
    }

    const parentPath = getParentPath(path)

    const eitherParent = await createDirectory(directory)(parentPath)

    const extension = getFileExtension(path)

    const encoding = (charset(extension) || "utf-8").toLowerCase() as BufferEncoding

    if (!contentStream) {
      await promises.writeFile(absolutePath, "", { encoding })
    } else {
      const writableStream = createWriteStream(absolutePath, { encoding })

      await promiseWriteStream(contentStream, writableStream)
    }

    const { size, atime, mtime, birthtime } = await promises.stat(absolutePath)
    const depth = getDepth(path)
    const [createdAt, updatedAt, accessedAt] = [birthtime, mtime, atime]

    const ordoFile = createOrdoFile({ path, accessedAt, createdAt, depth, size, updatedAt })

    const parent = eitherParent.getOrElse(() => null)

    if (!parent) return Either.right(ordoFile)

    const absoluteParentPath = getNormalizedAbsolutePath(parent.path, directory)

    const createdDirectory = (await listDirectory(absoluteParentPath, directory)) as OrdoDirectory

    return Either.right(createdDirectory)
  }
