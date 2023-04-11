import { IOrdoFile } from "@ordo-pink/common-types"
import { memo } from "react"
import { BsFileEarmarkBinary } from "react-icons/bs"
import { useFileAssociationFor } from "../hooks/use-file-asssociation"

type Props = {
  file: IOrdoFile
}

export const FileIcon = memo(
  ({ file }: Props) => {
    const currentFileAssociation = useFileAssociationFor(file)
    const Icon = currentFileAssociation?.Icon ?? (() => <BsFileEarmarkBinary />)

    return <Icon file={file} />
  },
  (prev, next) => prev.file.path === next.file.path,
)
