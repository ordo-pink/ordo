import { FilePath } from "$core/types"
import { getFileExtension } from "$fs/driver/utils/get-file-extension"

export const getReadableFileName = (path: FilePath): string => {
  const lastSeparatorPosition = path.lastIndexOf("/") + 1
  const readableName = path.slice(lastSeparatorPosition)
  const extension = getFileExtension(path)
  const readableNameWithoutExtension = readableName.replace(extension, "")

  return readableNameWithoutExtension !== "" ? readableNameWithoutExtension : readableName
}
