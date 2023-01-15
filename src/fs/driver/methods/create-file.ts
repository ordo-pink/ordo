import { createWriteStream, existsSync, promises } from "fs"
import { join } from "path"
import { pipeline, Readable, Writable } from "stream"
import { charset } from "mime-types"

import { Either } from "$core/either"
import { FSDriver, OrdoDirectory, OrdoFile } from "$core/types"

import { Exception } from "$fs/constants"
import { createDirectory } from "$fs/driver/methods/create-directory"
import { createOrdoFile } from "$fs/driver/utils/create-ordo-file"
import { getDepth } from "$fs/driver/utils/get-depth"
import { getFileExtension } from "$fs/driver/utils/get-file-extension"
import { getParentPath } from "$fs/driver/utils/get-parent-path"

export const createFile =
  (directory: string): FSDriver["createFile"] =>
  async (path, contentStream) => {
    const absolutePath = join(directory, path)

    if (existsSync(absolutePath)) {
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

    return eitherParent.fold(
      () => Either.right<OrdoFile, Exception.CONFLICT>(ordoFile),
      (parent) => {
        parent.children.push(ordoFile)

        return Either.right<OrdoDirectory, Exception.CONFLICT>(parent)
      },
    )
  }

const promiseWriteStream = (readable: Readable, writable: Writable) =>
  new Promise<void>((resolve, reject) =>
    pipeline(readable, writable, (error) => {
      if (error) return reject(error)
      resolve()
    }),
  )
