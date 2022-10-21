import React, { FC } from "react"

import type { OrdoFile, OrdoDirectory } from "@core/app/types"
import { useFileExplorerComponent } from "@client/file-explorer/hooks/use-file-explorer-component"

type Props = {
  item: OrdoFile | OrdoDirectory
}

export default function FileOrDirectory({ item }: Props) {
  const Component = useFileExplorerComponent(item) as FC<Props>

  return <Component item={item} />
}
