import {
  IOrdoDirectory,
  IOrdoDirectoryStatic,
  OrdoDirectoryPath,
  IOrdoFile,
} from "@ordo-pink/common-types"
import { isValidPath, endsWithSlash } from "../common"
import { OrdoFile } from "../ordo-file"

export const OrdoDirectory: IOrdoDirectoryStatic = {
  isOrdoDirectory: (x): x is IOrdoDirectory =>
    Boolean(x) &&
    typeof (x as IOrdoDirectory).path === "string" &&
    typeof (x as IOrdoDirectory).fsid === "string",
  isValidPath: (path): path is OrdoDirectoryPath =>
    typeof path === "string" && isValidPath(path) && endsWithSlash(path),
  sort: (children) => {
    return children.sort((a, b) => {
      if (!OrdoDirectory.isOrdoDirectory(a) && OrdoDirectory.isOrdoDirectory(b)) {
        return 1
      }

      if (OrdoDirectory.isOrdoDirectory(a) && !OrdoDirectory.isOrdoDirectory(b)) {
        return -1
      }

      return a.path.localeCompare(b.path)
    })
  },
  getReadableName: (path) => {
    if (!OrdoDirectory.isValidPath(path)) {
      throw new TypeError("Invalid directory path")
    }

    const lastSeparatorPosition = path.slice(0, -1).lastIndexOf("/") + 1

    return path.slice(lastSeparatorPosition, -1)
  },
  getParentPath: (path) => {
    if (!OrdoDirectory.isValidPath(path)) {
      throw new TypeError("Invalid directory path")
    }

    const sliceablePath = path.slice(0, -1)

    if (!sliceablePath) return path

    const lastSeparatorPosition = sliceablePath.lastIndexOf("/") + 1

    return sliceablePath.slice(0, lastSeparatorPosition) as OrdoDirectoryPath
  },
  findParent: (path, root) => {
    if (!OrdoDirectory.isValidPath(path)) {
      throw new TypeError("Invalid directory path")
    }

    const parentPath = OrdoDirectory.getParentPath(path as OrdoDirectoryPath)

    const found = root.find(
      (item) => OrdoDirectory.isOrdoDirectory(item) && item.path === parentPath,
    )

    if (!found) return null

    return found as IOrdoDirectory
  },
  findDirectoryDeep: (path, root) => {
    const found = root.find((item) => OrdoDirectory.isOrdoDirectory(item) && item.path === path)

    if (!found) return null

    return found as IOrdoDirectory
  },
  findFileDeep: (path, root) => {
    const found = root.find((item) => OrdoFile.isOrdoFile(item) && item.path === path)

    if (!found) return null

    return found as IOrdoFile
  },
  getDirectoriesDeep: (directory, root) => {
    return root.filter(
      (item) => OrdoDirectory.isOrdoDirectory(item) && item.path.startsWith(directory.path),
    ) as IOrdoDirectory[]
  },
  getFilesDeep: (directory, root) => {
    return root.filter(
      (item) => OrdoFile.isOrdoFile(item) && item.path.startsWith(directory.path),
    ) as IOrdoFile[]
  },
}
