import type { OrdoFile } from "@core/app/types"

import { createRoot } from "@core/app/parsers/create-root"
import { parseMetadata } from "@core/app/parsers/parse-ordo-file"
import { getFileReader } from "@main/app/get-file-reader"

export const handleOpenFile = async (file: OrdoFile) => {
  const fileReader = getFileReader(file)
  const raw = await fileReader(file)

  const root = createRoot(raw)
  const metadata = parseMetadata(root).data
  file.metadata = metadata as OrdoFile["metadata"]

  return { file, raw }
}
