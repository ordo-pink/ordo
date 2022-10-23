import type { OrdoFile } from "@core/app/types"
import type { RootNode } from "@client/editor/types"

import { parseTextFile } from "@core/app/parsers/parse-text-file"
import { parseOrdoFile } from "@core/app/parsers/parse-ordo-file"
import { getFileType } from "@core/get-file-type"
import Switch from "@client/common/utils/switch"

// TODO: Move everything from core to client, then drop client
export const getFileParser = (file: OrdoFile): ((raw: string) => RootNode) => {
  const type = getFileType(file)

  return Switch.of(type)
    .case("ordo", parseOrdoFile)
    .case("image", parseTextFile) // TODO: 72
    .default(parseTextFile)
}
