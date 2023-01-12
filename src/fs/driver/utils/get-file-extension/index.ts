import { OrdoFileExtension, OrdoFilePath } from "$core/types"

export const getFileExtension = (path: OrdoFilePath): OrdoFileExtension => {
  const fileName = path.split("/").reverse()[0] as string

  const lastDotPosition = fileName.lastIndexOf(".")

  if (!~lastDotPosition) {
    return ""
  }

  return fileName.substring(lastDotPosition) as OrdoFileExtension
}
