import { createReadStream, createWriteStream, promises } from "fs"
import { join } from "path"
import { promiseWriteStream } from "@ordo-pink/backend-fs-utils"
import { FSDriver } from "@ordo-pink/backend-universal"
import { OrdoDirectoryPath, OrdoFilePath, UnaryFn } from "@ordo-pink/common-types"

// Public ---------------------------------------------------------------------

// Impl -----------------------------------------------------------------------

/**
 * FS driver for ordo that uses files and directories on the disk to store the
 * data.
 *
 * @param rootDirectory Path to the directory where the data should be stored.
 */
export const createFSDriver = (rootDirectory: string): FSDriver => {
  const getAbsolutePath = toAbsolutePath(rootDirectory)

  return {
    checkDirectoryExists: checkDirectoryExists(getAbsolutePath),
    checkFileExists: checkFileExists(getAbsolutePath),
    createDirectory: createDirectory(getAbsolutePath),
    createFile: createFile(getAbsolutePath),
    deleteDirectory: deleteDirectory(getAbsolutePath),
    deleteFile: deleteFile(getAbsolutePath),
    getDirectoryChildren: getDirectoryChildren(getAbsolutePath),
    getFile: getFile(getAbsolutePath),
    getFileDescriptor: getFileDescriptor(getAbsolutePath),
    moveDirectory: moveDirectory(getAbsolutePath),
    moveFile: moveFile(getAbsolutePath),
    updateFile: updateFile(getAbsolutePath),
  }
}

// Internal -------------------------------------------------------------------

// Types ----------------------------------------------------------------------

type WithAbsolutePathFn<T = unknown> = UnaryFn<ReturnType<typeof toAbsolutePath>, T>

// Impl -----------------------------------------------------------------------

/**
 * Turns path into absolute path. Needed for the file system to work correctly.
 */
const toAbsolutePath = (absolute: string) => (path: string) => join(absolute, path)

const checkDirectoryExists: WithAbsolutePathFn<FSDriver["checkDirectoryExists"]> =
  (getAbsolutePath) => (path) =>
    promises
      .stat(getAbsolutePath(path))
      .catch(() => false)
      .then(Boolean)

const checkFileExists: WithAbsolutePathFn<FSDriver["checkFileExists"]> =
  (getAbsolutePath) => (path) =>
    promises
      .stat(getAbsolutePath(path))
      .catch(() => false)
      .then(Boolean)

const createDirectory: WithAbsolutePathFn<FSDriver["createDirectory"]> =
  (getAbsolutePath) => (path) =>
    promises.mkdir(getAbsolutePath(path)).then(() => path)

const createFile: WithAbsolutePathFn<FSDriver["createFile"]> =
  (getAbsolutePath) =>
  ({ path, content }) =>
    content
      ? promiseWriteStream(content, createWriteStream(getAbsolutePath(path))).then(() => path)
      : promises.writeFile(getAbsolutePath(path), "", "utf8").then(() => path)

const deleteDirectory: WithAbsolutePathFn<FSDriver["deleteDirectory"]> =
  (getAbsolutePath) => (path) =>
    promises.rm(getAbsolutePath(path), { recursive: true, force: true }).then(() => path)

const deleteFile: WithAbsolutePathFn<FSDriver["deleteFile"]> = (getAbsolutePath) => (path) =>
  promises.unlink(getAbsolutePath(path)).then(() => path)

const getDirectoryChildren: WithAbsolutePathFn<FSDriver["getDirectoryChildren"]> =
  (getAbsolutePath) => (path) =>
    promises
      .readdir(getAbsolutePath(path), { withFileTypes: true })
      .then((children) =>
        children.map((child) =>
          child.isDirectory()
            ? (`${path}${child.name}/` as OrdoDirectoryPath)
            : (`${path}${child.name}` as OrdoFilePath),
        ),
      )

const getFile: WithAbsolutePathFn<FSDriver["getFile"]> = (getAbsolutePath) => (path) =>
  Promise.resolve(createReadStream(getAbsolutePath(path)))

const getFileDescriptor: WithAbsolutePathFn<FSDriver["getFileDescriptor"]> =
  (getAbsolutePath) => (path) =>
    promises.stat(getAbsolutePath(path)).then(({ size, mtime }) => ({
      path,
      size,
      updatedAt: mtime,
    }))

const moveDirectory: WithAbsolutePathFn<FSDriver["moveDirectory"]> =
  (getAbsolutePath) =>
  ({ oldPath, newPath }) =>
    promises.rename(getAbsolutePath(oldPath), getAbsolutePath(newPath)).then(() => newPath)

const moveFile: WithAbsolutePathFn<FSDriver["moveFile"]> =
  (getAbsolutePath) =>
  ({ oldPath, newPath }) =>
    promises.rename(getAbsolutePath(oldPath), getAbsolutePath(newPath)).then(() => newPath)

const updateFile: WithAbsolutePathFn<FSDriver["updateFile"]> =
  (getAbsolutePath) =>
  ({ path, content }) =>
    promiseWriteStream(content, createWriteStream(getAbsolutePath(path))).then(() => path)
