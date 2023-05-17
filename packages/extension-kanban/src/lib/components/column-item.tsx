import { OrdoDirectoryDTO, IOrdoFile, OrdoFilePath } from "@ordo-pink/common-types"
import { useFileAssociationFor } from "@ordo-pink/react-utils"
import Card from "./card"
import ImageCard from "./image-card"

type Props = {
  path: OrdoFilePath
  index: number
  parent: OrdoDirectoryDTO
}

export default function ColumnItem({ path, index, parent }: Props) {
  const file = parent.children.find((child) => child.path === path)

  if (!file) return null

  const association = useFileAssociationFor(file as IOrdoFile)

  // TODO: Size-dependent rendering
  return association && association.name === "editor.img" ? (
    <ImageCard
      key={file.path}
      file={file as IOrdoFile}
      index={index}
    />
  ) : (
    <Card
      key={file.path}
      file={file as IOrdoFile}
      index={index}
    />
  )
}
