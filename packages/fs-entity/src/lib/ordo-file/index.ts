import { IOrdoFileStatic, IOrdoFile, IOrdoFileRaw, OrdoFilePath, OrdoFileExtension } from "./types"
import { endsWithSlash, isValidPath } from "../common"
import { OrdoDirectoryPath } from "../ordo-directory/types"

export const OrdoFile: IOrdoFileStatic = {
  of: (raw) => ordoFile(raw),
  raw: (params) => {
    if (!OrdoFile.isValidPath(params.path)) {
      throw new TypeError("Invalid file path")
    }

    const path = params.path
    const size = params.size
    const updatedAt = params.updatedAt ? new Date(params.updatedAt) : new Date()

    return { path, size, updatedAt }
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
}

export const ordoFile = (raw: IOrdoFileRaw): IOrdoFile => {
  if (!OrdoFile.isValidPath(raw.path)) {
    throw new TypeError("Invalid file path")
  }

  const { path, size, updatedAt } = raw

  const readableName = OrdoFile.getReadableName(raw.path)
  const extension = OrdoFile.getFileExtension(raw.path)

  return {
    readableName,
    extension,
    path,
    updatedAt: new Date(updatedAt),
    size,
  }
}
