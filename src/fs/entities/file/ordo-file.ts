import {
  IOrdoDirectory,
  IOrdoFile,
  IOrdoFileInitProps,
  OrdoDirectoryPath,
  OrdoFileExtension,
  OrdoFilePath,
} from "../../types"
import { isValidPath, endsWithSlash } from "../common"

export const OrdoFile = {
  of: ({ path, size, updatedAt = new Date() }: IOrdoFileInitProps): IOrdoFile => ({
    path,
    readableName: OrdoFile.getReadableName(path),
    extension: OrdoFile.getFileExtension(path),
    updatedAt,
    size,
  }),
  isValidPath: (path: string) => isValidPath(path) && !endsWithSlash(path),
  isOrdoFile: (x?: unknown): x is IOrdoDirectory =>
    Boolean(x) &&
    typeof (x as IOrdoFile).readableName === "string" &&
    typeof (x as IOrdoFile).extension === "string" &&
    typeof (x as IOrdoFile).size === "number" &&
    typeof (x as IOrdoFile).path === "string" &&
    OrdoFile.isValidPath((x as IOrdoFile).path),
  getFileExtension: (path: OrdoFilePath): OrdoFileExtension => {
    const fileName = path.split("/").reverse()[0] as string

    const lastDotPosition = fileName.lastIndexOf(".")

    if (!~lastDotPosition) {
      return ""
    }

    return fileName.substring(lastDotPosition) as OrdoFileExtension
  },
  getParentPath: (path: OrdoFilePath): OrdoDirectoryPath => {
    const lastSeparatorPosition = path.lastIndexOf("/") + 1

    return path.slice(0, lastSeparatorPosition) as OrdoDirectoryPath
  },
  getReadableName: (path: OrdoFilePath): string => {
    const lastSeparatorPosition = path.lastIndexOf("/") + 1
    const readableName = path.slice(lastSeparatorPosition)
    const extension = OrdoFile.getFileExtension(path)

    return readableName.replace(extension, "")
  },
}
