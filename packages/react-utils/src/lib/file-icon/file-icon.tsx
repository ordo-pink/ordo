import { IOrdoFile } from "@ordo-pink/common-types"
import { useFileAssociationFor } from "@ordo-pink/react-utils"
import { BsFileEarmarkBinary } from "react-icons/bs"

type Props = {
  file: IOrdoFile
}

export const FileIcon = ({ file }: Props) => {
  const currentFileAssociation = useFileAssociationFor(file)
  const Icon = currentFileAssociation?.Icon ?? (() => <BsFileEarmarkBinary />)

  return <Icon file={file} />
}
