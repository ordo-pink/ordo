import { createReadStream, createWriteStream, promises } from "fs"
import { join } from "path"
import { FSDriver, promiseWriteStream, OrdoDirectoryPath, OrdoFilePath } from "../../fs"

const getAbsolutePath = (absolute: string) => (path: string) => join(absolute, path)

export const createDefaultFSDriver = (rootDirectory: string): FSDriver => {
  const absolute = getAbsolutePath(join(rootDirectory, "/"))

  return {
    checkDirectoryExists: (path) => {
      return promises
        .stat(absolute(path))
        .catch(() => null)
        .then(Boolean)
    },
    checkFileExists: (path) =>
      promises
        .stat(absolute(path))
        .catch(() => null)
        .then(Boolean),
    createDirectory: (path) => promises.mkdir(absolute(path)).then(() => path),
    createFile: ({ path, content }) =>
      content
        ? promiseWriteStream(content, createWriteStream(absolute(path))).then(() => path)
        : promises.writeFile(absolute(path), "", "utf8").then(() => path),
    deleteDirectory: (path) =>
      promises.rm(absolute(path), { recursive: true, force: true }).then(() => path),
    deleteFile: (path) => promises.unlink(absolute(path)).then(() => path),
    getDirectoryChildren: (path) =>
      promises
        .readdir(absolute(path), { withFileTypes: true })
        .then((children) =>
          children.map((child) =>
            child.isDirectory()
              ? (`${path}/${child.name}/` as OrdoDirectoryPath)
              : (`${path}/${child.name}` as OrdoFilePath),
          ),
        ),
    getFile: (path) => Promise.resolve(createReadStream(absolute(path))),
    getFileDescriptor: (path) =>
      promises.stat(absolute(path)).then(({ size, mtime }) => ({
        path,
        size,
        updatedAt: mtime,
      })),
    moveDirectory: ({ oldPath, newPath }) =>
      promises.rename(absolute(oldPath), absolute(newPath)).then(() => newPath),
    moveFile: ({ oldPath, newPath }) =>
      promises.rename(absolute(oldPath), absolute(newPath)).then(() => newPath),
    updateFile: ({ path, content }) =>
      promiseWriteStream(content, createWriteStream(absolute(path))).then(() => path),
  }
}
