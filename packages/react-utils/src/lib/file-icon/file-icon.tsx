import { IOrdoFile, IconSize } from "@ordo-pink/common-types"
import { memo } from "react"
import { BsFileEarmarkBinary } from "react-icons/bs"
import { useFileAssociationFor } from "../hooks/use-file-asssociation"

type Props = {
  file: IOrdoFile
  size: IconSize
}

export const FileIcon = memo(
  ({ file, size }: Props) => {
    const currentFileAssociation = useFileAssociationFor(file)
    const Icon = currentFileAssociation?.Icon ?? (() => <BsFileEarmarkBinary />)

    return (
      <Icon
        size={size}
        file={file}
      />
    )
  },
  (prev, next) => prev.file.path === next.file.path,
)
