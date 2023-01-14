import { OrdoDirectoryPath, OrdoFilePath } from "$core/types"
import { getFileExtension } from "$fs/driver/utils/get-file-extension"

export const getReadableFileName = (path: OrdoFilePath): string => {
  const lastSeparatorPosition = path.lastIndexOf("/") + 1
  const readableName = path.slice(lastSeparatorPosition)
  const extension = getFileExtension(path)
  const readableNameWithoutExtension = readableName.replace(extension, "")

  return readableNameWithoutExtension !== "" ? readableNameWithoutExtension : readableName
}

export const getReadableDirectoryName = (path: OrdoDirectoryPath): string => {
  const lastSeparatorPosition = path.slice(0, -1).lastIndexOf("/") + 1
  return path.slice(lastSeparatorPosition, -1)
}
