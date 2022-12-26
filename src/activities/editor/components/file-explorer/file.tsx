import { MouseEvent } from "react"
import { BsFileEarmarkBinary, BsFileX } from "react-icons/bs"
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom"

import { useContextMenu } from "$containers/app/hooks/use-context-menu"
import { removedFile } from "$containers/app/store"
import ActionListItem from "$core/components/action-list/item"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch.hook"
import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"
import { OrdoFile } from "$core/types"
import { Either } from "$core/utils/either"
import { noOp } from "$core/utils/no-op"

type Props = {
  item: OrdoFile
}

export default function File({ item }: Props) {
  const navigate = useNavigate()
  const [query] = useSearchParams()
  const dispatch = useAppDispatch()

  const { showContextMenu } = useContextMenu()

  const isCurrent = query.has("path") && query.get("path") === item.path

  const fileAssociations = useAppSelector((state) => state.app.fileAssociationExtensions)
  const association = fileAssociations.find((assoc) =>
    assoc.fileExtensions.includes(item.extension),
  )
  const Icon = association && association.Icon ? association.Icon : BsFileEarmarkBinary

  const paddingLeft = `${item.depth * 10}px`

  const structure = {
    children: [
      {
        action: () => void dispatch(removedFile(item.path)),
        Icon: BsFileX,
        title: "@ordo-activity-editor/remove",
        accelerator: "ctrl+backspace",
      },
    ],
  }

  const handleClick = () => {
    navigate({
      pathname: "/editor",
      search: createSearchParams({
        association: association ? association.name : "unsupported",
        path: item.path,
      }).toString(),
    })
  }

  const handleContextMenu = (event: MouseEvent) =>
    Either.of(event)
      .tap((event) => event.preventDefault())
      .tap((event) => event.stopPropagation())
      .fold(noOp, () => dispatch(showContextMenu({ event, target: item, structure })))

  return (
    <ActionListItem
      style={{ paddingLeft }}
      text={item.readableName}
      Icon={Icon}
      isCurrent={isCurrent}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    />
  )
}
