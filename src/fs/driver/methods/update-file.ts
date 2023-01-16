import { createWriteStream, promises } from "fs"
import { join } from "path"
import { charset } from "mime-types"

import { Either } from "$core/either"
import { FSDriver } from "$core/types"

import { Exception } from "$fs/constants"
import { createOrdoFile } from "$fs/driver/utils/create-ordo-file"
import { getDepth } from "$fs/driver/utils/get-depth"
import { getFileExtension } from "$fs/driver/utils/get-file-extension"
import { promiseWriteStream } from "$fs/driver/utils/promise-write-stream"

export const updateFile =
  (directory: string): FSDriver["updateFile"] =>
  async (path, contentStream) => {
    const absolutePath = join(directory, path)

    const stat = await promises.stat(absolutePath).catch(() => null)

    if (!stat || !stat.isFile()) {
      return Either.left(Exception.NOT_FOUND)
    }

    const extension = getFileExtension(path)

    const encoding = (charset(extension) || "utf-8").toLowerCase() as BufferEncoding

    const writableStream = createWriteStream(absolutePath, { encoding })

    await promiseWriteStream(contentStream, writableStream)

    const { size, atime, mtime, birthtime } = await promises.stat(absolutePath)
    const depth = getDepth(path)
    const [createdAt, updatedAt, accessedAt] = [birthtime, mtime, atime]

    const ordoFile = createOrdoFile({ path, accessedAt, createdAt, depth, size, updatedAt })

    return Either.right(ordoFile)
  }
