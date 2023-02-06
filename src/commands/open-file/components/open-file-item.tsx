import { MouseEvent } from "react"
import { BsFileEarmarkBinary } from "react-icons/bs"

import ActionListItem from "$core/components/action-list/item"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { OrdoFile, UnaryFn } from "$core/types"
import { preventDefault, stopPropagation } from "$core/utils/event"
import { lazyBox } from "$core/utils/lazy-box"
import { noOp } from "$core/utils/no-op"

type Props = {
  isCurrent: boolean
  file: OrdoFile
  onClick?: UnaryFn<OrdoFile, void>
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
