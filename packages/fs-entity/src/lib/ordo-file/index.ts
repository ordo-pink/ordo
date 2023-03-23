import {
  IOrdoFileStatic,
  IOrdoFile,
  IOrdoFileRaw,
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
  of: (raw) => ordoFile(raw),
  raw: (params) => {
    if (!OrdoFile.isValidPath(params.path)) {
      throw new TypeError("Invalid file path")
    }

    const path = params.path
    const size = params.size
    const metadata = params.metadata ?? {}
    const updatedAt = params.updatedAt ? new Date(params.updatedAt) : new Date()

    return { path, size, updatedAt, metadata }
  },
  empty: (path) => OrdoFile.from({ path, size: 0, updatedAt: new Date() }),
  from: (params) => OrdoFile.of(OrdoFile.raw(params)),
  isOrdoFile: (x): x is IOrdoFile =>
    Boolean(x) &&
    typeof (x as IOrdoFile).readableName === "string" &&
    typeof (x as IOrdoFile).extension === "string" &&
    OrdoFile.isOrdoFileRaw(x),
  isOrdoFileRaw: (x): x is IOrdoFileRaw =>
    Boolean(x) &&
    typeof (x as IOrdoFileRaw).size === "number" &&
    typeof (x as IOrdoFileRaw).path === "string" &&
    OrdoFile.isValidPath((x as IOrdoFileRaw).path),
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

export const ordoFile = (raw: IOrdoFileRaw): IOrdoFile => {
  if (!OrdoFile.isValidPath(raw.path)) {
    throw new TypeError("Invalid file path")
  }

  const { path, size, updatedAt, metadata } = raw

  const readableName = OrdoFile.getReadableName(raw.path)
  const extension = OrdoFile.getFileExtension(raw.path)
  const readableSize = toReadableSize(size)

  return {
    readableName,
    extension,
    path,
    updatedAt: new Date(updatedAt),
    size,
    readableSize,
    metadata,
  }
}
