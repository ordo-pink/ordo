import type { OrdoFilePath, OrdoFile } from "$core/types"

import { getDepth } from "$fs/driver/utils/get-depth"
import { getFileExtension } from "$fs/driver/utils/get-file-extension"
import { getReadableFileName } from "$fs/driver/utils/get-readable-name"

type Props<Metadata extends Record<string, unknown> = Record<string, unknown>> = {
  path: OrdoFilePath
  createdAt?: Date
  updatedAt?: Date
  accessedAt?: Date
  depth?: number
  size?: number
  metadata?: Metadata
}
export const createOrdoFile = <Metadata extends Record<string, unknown> = Record<string, unknown>>(
  props: Props<Metadata>,
): OrdoFile<Metadata> => {
  const path = props.path

  const createdAt = props.createdAt ?? new Date()
  const updatedAt = props.updatedAt ?? new Date()
  const accessedAt = props.accessedAt ?? new Date()
  const metadata = props.metadata ?? ({} as Metadata)
  const size = props.size ?? 0

  const depth = getDepth(path)
  const extension = getFileExtension(path)
  const readableName = getReadableFileName(path)

  return {
    path,
    readableName,
    createdAt,
    updatedAt,
    accessedAt,
    depth,
    metadata,
    extension,
    size,
  }
}
