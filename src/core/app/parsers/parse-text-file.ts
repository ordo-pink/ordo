import type { RootNode } from "@client/editor/types"

import { createRoot } from "@core/app/parsers/create-root"

export const parseTextFile = (raw: string): RootNode => {
  return createRoot(raw)
}
