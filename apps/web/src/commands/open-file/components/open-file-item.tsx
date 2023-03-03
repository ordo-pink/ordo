import { UnaryFn } from "@ordo-pink/common-types"
import { noOp, lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
import { IOrdoFile } from "@ordo-pink/fs-entity"
import { ActionListItem } from "@ordo-pink/react-utils"
import { MouseEvent } from "react"
import { BsFileEarmarkBinary } from "react-icons/bs"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"

type Props = {
  isCurrent: boolean
  file: IOrdoFile
  onClick?: UnaryFn<IOrdoFile, void>
}

export default function OpenFileItem({ file, isCurrent, onClick = noOp }: Props) {
  const fileAssociations = useAppSelector((state) => state.app.fileAssociationExtensions)

  const association = fileAssociations.find((assoc) =>
    assoc.fileExtensions.includes(file.extension),
  )

  const Icon = association && association.Icon ? association.Icon : BsFileEarmarkBinary

  const handleClick = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .map(() => file)
      .fold(onClick),
  )

  return (
    <ActionListItem
      text={file.readableName}
      onClick={handleClick}
      Icon={Icon}
      isCurrent={isCurrent}
    />
  )
}
