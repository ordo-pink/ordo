import type { DirectoryPath, OrdoDirectory } from "$core/types"

import { getDepth } from "$fs/driver/utils/get-depth"
import { getReadableFileName } from "$fs/driver/utils/get-readable-name"

type Props<Metadata extends Record<string, unknown> = Record<string, unknown>> = {
  path: DirectoryPath
  createdAt?: Date
  updatedAt?: Date
  accessedAt?: Date
  depth?: number
  metadata?: Metadata
}
export const createOrdoDirectory = <
  Metadata extends Record<string, unknown> = Record<string, unknown>,
>(
  props: Props<Metadata>,
): OrdoDirectory<Metadata> => {
  const path = props.path

  const createdAt = props.createdAt ?? new Date()
  const updatedAt = props.updatedAt ?? new Date()
  const accessedAt = props.accessedAt ?? new Date()
  const metadata = props.metadata ?? ({} as Metadata)

  const depth = getDepth(path)
  const readableName = getReadableFileName(path)

  return {
    path,
    readableName,
    createdAt,
    updatedAt,
    accessedAt,
    depth,
    metadata,
    children: [],
  }
}
