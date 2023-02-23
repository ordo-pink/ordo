import type { OrdoFile } from "@core/app/types"

import { promises } from "fs"

export const imageFileReader = async (file: OrdoFile) => {
  const content = await promises.readFile(file.path, "base64")
  const extensionWithoutDot = file.extension?.slice(1)
  const header = `data:image/${extensionWithoutDot};base64,`

  return header.concat(content)
}
