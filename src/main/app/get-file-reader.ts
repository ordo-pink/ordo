import type { OrdoFile } from "@core/app/types"

import { defaultFileReader } from "@main/app/file-readers/default"
import { imageFileReader } from "@main/app/file-readers/image"
import Switch from "@core/utils/switch"
import { getFileType } from "@core/get-file-type"

export const getFileReader = (file: OrdoFile) => {
  const type = getFileType(file)

  return Switch.of(type).case("image", imageFileReader).default(defaultFileReader)
}
