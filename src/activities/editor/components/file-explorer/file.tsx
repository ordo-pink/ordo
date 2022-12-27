import { MouseEvent } from "react"
import { BsFileEarmarkBinary, BsFileX } from "react-icons/bs"
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom"

import { useContextMenu } from "$containers/app/hooks/use-context-menu"
import { useDeleteModal } from "$containers/app/hooks/use-delete-modal"

import ActionListItem from "$core/components/action-list/item"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { OrdoFile } from "$core/types"
import { Either } from "$core/utils/either"
import { noOp } from "$core/utils/no-op"

type Props = {
  file: OrdoFile
}

export default function File({ file }: Props) {
  const navigate = useNavigate()
  const [query] = useSearchParams()
  const dispatch = useAppDispatch()

  const { showContextMenu } = useContextMenu()
  const { showDeleteFileModal } = useDeleteModal()

  const isCurrent = query.has("path") && query.get("path") === file.path

  const fileAssociations = useAppSelector((state) => state.app.fileAssociationExtensions)
  const association = fileAssociations.find((assoc) =>
    assoc.fileExtensions.includes(file.extension),
  )
  const Icon = association && association.Icon ? association.Icon : BsFileEarmarkBinary

  const paddingLeft = `${file.depth * 10}px`

  const structure = {
    children: [
      {
        action: () => void dispatch(showDeleteFileModal(file)),
        Icon: BsFileX,
        title: "@ordo-activity-editor/remove",
        accelerator: "ctrl+backspace",
      },
    ],
  }

  const handleClick = (event: MouseEvent) =>
    Either.of(event)
      .tap((e) => e.preventDefault())
      .tap((e) => e.stopPropagation())
      .fold(noOp, () =>
        navigate({
          pathname: "/editor",
          search: createSearchParams({
            association: association ? association.name : "unsupported",
            path: file.path,
          }).toString(),
        }),
      )

  const handleContextMenu = (event: MouseEvent) =>
    Either.of(event)
      .tap((e) => e.preventDefault())
      .tap((e) => e.stopPropagation())
      .fold(noOp, () => dispatch(showContextMenu({ event, target: file, structure })))

  return (
    <ActionListItem
      style={{ paddingLeft }}
      text={file.readableName}
      Icon={Icon}
      isCurrent={isCurrent}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    />
  )
}
