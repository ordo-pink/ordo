import type { OrdoFile, OrdoPath, OrdoRelativePath } from "@core/app/types"

import { sep } from "path"
import { slice, lastIndexOf, pipe, add } from "ramda"

import { Color } from "@core/colors"

type Props = {
  path: OrdoPath
  relativePath: OrdoRelativePath
  depth: number
  createdAt: Date
  updatedAt: Date
  accessedAt: Date
  size: number
}

const removeLastSeparator = slice(0, -1)
const getLastSeparatorPosition = pipe(lastIndexOf(sep), add(1))

export const createOrdoFile = (props: Props): OrdoFile => {
  const hasSeparatorAtTheEnd = props.path.endsWith(sep)
  const splittablePath = hasSeparatorAtTheEnd ? removeLastSeparator(props.path) : props.path
  const lastSeparatorPosition = getLastSeparatorPosition(splittablePath)
  const readableName = splittablePath.slice(lastSeparatorPosition)
  const lastDotPosition = readableName.lastIndexOf(".")
  const extension = readableName.substring(lastDotPosition) as `.${string}`

  return {
    ...props,
    readableName,
    extension,
    metadata: {
      color: Color.NEUTRAL,
      tags: [],
      checkboxes: [],
      dates: [],
      links: [],
      raw: "",
    },
  }
}
