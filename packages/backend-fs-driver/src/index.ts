import { createReadStream, createWriteStream, promises } from "fs"
import { join } from "path"
import { DirectoryPath, FilePath, UnaryFn } from "@ordo-pink/common-types"
import { promiseWriteStream } from "./utils"

// Public ---------------------------------------------------------------------

// Impl -----------------------------------------------------------------------

/**
 * FS driver for ordo that uses files and directories on the disk to store the
 * data.
 *
 * @param rootDirectory Path to the directory where the data should be stored.
 */
export const createFSDriver = (rootDirectory: string): FSDriver => {
  const getAbsolutePath = _toAbsolutePath(rootDirectory)

  return {
    checkDirectoryExists: _checkDirectoryExists(getAbsolutePath),
    checkFileExists: _checkFileExists(getAbsolutePath),
    createDirectory: _createDirectory(getAbsolutePath),
    createFile: _createFile(getAbsolutePath),
    deleteDirectory: _deleteDirectory(getAbsolutePath),
    deleteFile: _deleteFile(getAbsolutePath),
    getDirectoryChildren: _getDirectoryChildren(getAbsolutePath),
    getFile: _getFile(getAbsolutePath),
    getFileDescriptor: _getFileDescriptor(getAbsolutePath),
    moveDirectory: _moveDirectory(getAbsolutePath),
    moveFile: _moveFile(getAbsolutePath),
    updateFile: _updateFile(getAbsolutePath),
  }
}

// Internal -------------------------------------------------------------------

// Types ----------------------------------------------------------------------

type WithAbsolutePathFn<T = unknown> = UnaryFn<ReturnType<typeof _toAbsolutePath>, T>

// Impl -----------------------------------------------------------------------

/**
 * Turns path into absolute path. Needed for the file system to work correctly.
 */
const _toAbsolutePath = (absolute: string) => (path: string) => join(absolute, path)

const _checkDirectoryExists: WithAbsolutePathFn<FSDriver["checkDirectoryExists"]> =
  (getAbsolutePath) => (path) =>
    promises
      .stat(getAbsolutePath(path))
      .catch(() => false)
      .then(Boolean)

const _checkFileExists: WithAbsolutePathFn<FSDriver["checkFileExists"]> =
  (getAbsolutePath) => (path) =>
    promises
      .stat(getAbsolutePath(path))
      .catch(() => false)
      .then(Boolean)

const _createDirectory: WithAbsolutePathFn<FSDriver["createDirectory"]> =
  (getAbsolutePath) => (path) =>
    promises.mkdir(getAbsolutePath(path)).then(() => path)

const _createFile: WithAbsolutePathFn<FSDriver["createFile"]> =
  (getAbsolutePath) =>
  ({ path, content }) =>
    content
      ? promiseWriteStream(content, createWriteStream(getAbsolutePath(path))).then(() => path)
      : promises.writeFile(getAbsolutePath(path), "", "utf8").then(() => path)

const _deleteDirectory: WithAbsolutePathFn<FSDriver["deleteDirectory"]> =
  (getAbsolutePath) => (path) =>
    promises.rm(getAbsolutePath(path), { recursive: true, force: true }).then(() => path)

const _deleteFile: WithAbsolutePathFn<FSDriver["deleteFile"]> = (getAbsolutePath) => (path) =>
  promises.unlink(getAbsolutePath(path)).then(() => path)

const _getDirectoryChildren: WithAbsolutePathFn<FSDriver["getDirectoryChildren"]> =
  (getAbsolutePath) => (path) =>
    promises
      .readdir(getAbsolutePath(path), { withFileTypes: true })
      .then((children) =>
        children.map((child) =>
          child.isDirectory()
            ? (`${path}${child.name}/` as DirectoryPath)
            : (`${path}${child.name}` as FilePath),
        ),
      )

const _getFile: WithAbsolutePathFn<FSDriver["getFile"]> = (getAbsolutePath) => (path) =>
  Promise.resolve(createReadStream(getAbsolutePath(path)))

const _getFileDescriptor: WithAbsolutePathFn<FSDriver["getFileDescriptor"]> =
  (getAbsolutePath) => (path) =>
    promises.stat(getAbsolutePath(path)).then(({ size, mtime }) => ({
      path,
      size,
      updatedAt: mtime,
    }))

const _moveDirectory: WithAbsolutePathFn<FSDriver["moveDirectory"]> =
  (getAbsolutePath) =>
  ({ oldPath, newPath }) =>
    promises.rename(getAbsolutePath(oldPath), getAbsolutePath(newPath)).then(() => newPath)

const _moveFile: WithAbsolutePathFn<FSDriver["moveFile"]> =
  (getAbsolutePath) =>
  ({ oldPath, newPath }) =>
    promises.rename(getAbsolutePath(oldPath), getAbsolutePath(newPath)).then(() => newPath)

const _updateFile: WithAbsolutePathFn<FSDriver["updateFile"]> =
  (getAbsolutePath) =>
  ({ path, content }) =>
    promiseWriteStream(content, createWriteStream(getAbsolutePath(path))).then(() => path)
