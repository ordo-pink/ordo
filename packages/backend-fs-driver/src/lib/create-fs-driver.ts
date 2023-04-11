import { createReadStream, createWriteStream, promises } from "fs"
import { join } from "path"
import { promiseWriteStream } from "@ordo-pink/backend-fs-utils"
import { FSDriver } from "@ordo-pink/backend-universal"
import { OrdoDirectoryPath, OrdoFilePath } from "@ordo-pink/common-types"

const toAbsolutePath = (absolute: string) => (path: string) => join(absolute, path)

/**
 * FS driver for ordo that uses files and directories on the disk to store the
 * data.
 *
 * @param rootDirectory Path to the directory where the data should be stored
 */
export const createFSDriver = (rootDirectory: string): FSDriver => {
  const getAbsolute = toAbsolutePath(rootDirectory)

  return {
    checkDirectoryExists: (path) =>
      promises
        .stat(getAbsolute(path))
        .catch(() => false)
        .then(Boolean),
    checkFileExists: (path) =>
      promises
        .stat(getAbsolute(path))
        .catch(() => false)
        .then(Boolean),
    createDirectory: (path) => promises.mkdir(getAbsolute(path)).then(() => path),
    createFile: ({ path, content }) =>
      content
        ? promiseWriteStream(content, createWriteStream(getAbsolute(path))).then(() => path)
        : promises.writeFile(getAbsolute(path), "", "utf8").then(() => path),
    deleteDirectory: (path) =>
      promises.rm(getAbsolute(path), { recursive: true, force: true }).then(() => path),
    deleteFile: (path) => promises.unlink(getAbsolute(path)).then(() => path),
    getDirectoryChildren: (path) =>
      promises
        .readdir(getAbsolute(path), { withFileTypes: true })
        .then((children) =>
          children.map((child) =>
            child.isDirectory()
              ? (`${path}${child.name}/` as OrdoDirectoryPath)
              : (`${path}${child.name}` as OrdoFilePath),
          ),
        ),
    getFile: (path) => Promise.resolve(createReadStream(getAbsolute(path))),
    getFileDescriptor: (path) =>
      promises.stat(getAbsolute(path)).then(({ size, mtime }) => ({
        path,
        size,
        updatedAt: mtime,
      })),
    moveDirectory: ({ oldPath, newPath }) =>
      promises.rename(getAbsolute(oldPath), getAbsolute(newPath)).then(() => newPath),
    moveFile: ({ oldPath, newPath }) =>
      promises.rename(getAbsolute(oldPath), getAbsolute(newPath)).then(() => newPath),
    updateFile: ({ path, content }) =>
      promiseWriteStream(content, createWriteStream(getAbsolute(path))).then(() => path),
  }
}
