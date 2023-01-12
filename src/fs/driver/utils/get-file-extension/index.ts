import { FileExtension, FilePath } from "$core/types"

export const getFileExtension = (path: FilePath): FileExtension => {
  const fileName = path.split("/").reverse()[0] as string

  const lastDotPosition = fileName.lastIndexOf(".")

  if (!~lastDotPosition) {
    return ""
  }

  return fileName.substring(lastDotPosition) as FileExtension
}
