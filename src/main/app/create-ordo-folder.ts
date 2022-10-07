import type { OrdoFile, OrdoFolder, OrdoPath, OrdoRelativePath } from "@core/app/types"

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
}

const removeLastSeparator = slice(0, -1)
const getLastSeparatorPosition = pipe(lastIndexOf(sep), add(1))

export const createOrdoFolder = (props: Props): OrdoFolder => {
  const hasSeparatorAtTheEnd = props.path.endsWith(sep)
  const splittablePath = hasSeparatorAtTheEnd ? removeLastSeparator(props.path) : props.path
  const lastSeparatorPosition = getLastSeparatorPosition(splittablePath)
  const readableName = splittablePath.slice(lastSeparatorPosition)

  return {
    ...props,
    readableName,
    children: [] as Array<OrdoFile | OrdoFolder>,
    metadata: {
      color: Color.NEUTRAL,
    },
  }
}
