import {
  IOrdoFileStatic,
  IOrdoFile,
  OrdoFilePath,
  OrdoDirectoryPath,
  OrdoFileExtension,
} from "@ordo-pink/common-types"
import { endsWithSlash, isValidPath } from "../common"
import { OrdoDirectory } from "../ordo-directory"

const toReadableSize = (a: number, b = 2, k = 1024): string => {
  const d = Math.floor(Math.log(a) / Math.log(k))

  return a === 0
    ? "0B"
    : `${parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b)))} ${
        ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
      }`
}

export const OrdoFile: IOrdoFileStatic = {
  isOrdoFile: (x): x is IOrdoFile =>
    Boolean(x) &&
    typeof (x as IOrdoFile).fsid === "string" &&
    typeof (x as IOrdoFile).size === "number" &&
    typeof (x as IOrdoFile).path === "string" &&
    OrdoFile.isValidPath((x as IOrdoFile).path),

  isValidPath: (path): path is OrdoFilePath =>
    typeof path === "string" && isValidPath(path) && !endsWithSlash(path),
  getParentPath: (path) => {
    if (!OrdoFile.isValidPath(path)) {
      throw new TypeError("Invalid file path")
    }

    const lastSeparatorPosition = path.lastIndexOf("/") + 1

    return path.slice(0, lastSeparatorPosition) as OrdoDirectoryPath
  },
  getReadableName: (path) => {
    if (!OrdoFile.isValidPath(path)) {
      throw new TypeError("Invalid file path")
    }

    const lastSeparatorPosition = path.lastIndexOf("/") + 1
    const readableName = path.slice(lastSeparatorPosition)
    const extension = OrdoFile.getFileExtension(path as unknown as OrdoFilePath)

    return readableName.replace(extension, "")
  },
  getFileExtension: (path) => {
    if (!OrdoFile.isValidPath(path)) {
      throw new TypeError("Invalid file path")
    }

    const fileName = path.split("/").reverse()[0] as string

    const lastDotPosition = fileName.lastIndexOf(".")

    if (!~lastDotPosition) {
      return ""
    }

    return fileName.substring(lastDotPosition) as OrdoFileExtension
  },
  getReadableSize: (size) => {
    if (typeof size !== "number" || Number.isNaN(size) || !Number.isFinite(size) || size < 0) {
      throw new TypeError("Invalid size")
    }

    return toReadableSize(size)
  },
  findParent: (path, root) => {
    const parentPath = OrdoFile.getParentPath(path)

    return OrdoDirectory.findDirectoryDeep(parentPath, root)
  },
}
