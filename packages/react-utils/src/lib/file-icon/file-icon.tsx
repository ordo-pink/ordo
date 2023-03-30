import { IOrdoFile } from "@ordo-pink/common-types"
import { BsFileEarmarkBinary } from "react-icons/bs"
import { useFileAssociationFor } from "../hooks/use-file-asssociation"

type Props = {
  file: IOrdoFile
}

export const FileIcon = ({ file }: Props) => {
  const currentFileAssociation = useFileAssociationFor(file)
  const Icon = currentFileAssociation?.Icon ?? (() => <BsFileEarmarkBinary />)

  return <Icon file={file} />
}
