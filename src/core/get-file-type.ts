import type { OrdoFile } from "@core/app/types"

import { FileAssociations } from "@core/app/file-associations"

export const getFileType = (file: OrdoFile) =>
  Object.keys(FileAssociations).reduce(
    (acc, key: keyof typeof FileAssociations) =>
      FileAssociations[key].some((association) => file.extension === association) ? key : acc,
    "default"
  )
