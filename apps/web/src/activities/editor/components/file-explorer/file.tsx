import { lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
import { IOrdoFile } from "@ordo-pink/fs-entity"
import { ActionListItem } from "@ordo-pink/react"
import { MouseEvent } from "react"
import { Draggable } from "react-beautiful-dnd"
import { BsFileEarmarkBinary } from "react-icons/bs"
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom"
import { useContextMenu } from "../../../../containers/app/hooks/use-context-menu"
import { useAppDispatch } from "../../../../core/state/hooks/use-app-dispatch"
import { useAppSelector } from "../../../../core/state/hooks/use-app-selector"

type Props = {
  file: IOrdoFile
  index: number
}

export default function File({ file, index }: Props) {
  const dispatch = useAppDispatch()

  const fileAssociations = useAppSelector((state) => state.app.fileAssociationExtensions)

  const navigate = useNavigate()
  const [query] = useSearchParams()

  const { showContextMenu } = useContextMenu()

  const depth = file.path.split("/").filter(Boolean).length

  const paddingLeft = `${depth * 10}px`
  const isCurrent = query.has("path") && query.get("path") === file.path

  const association = fileAssociations.find((assoc) =>
    assoc.fileExtensions.includes(file.extension),
  )

  const Icon = association && association.Icon ? association.Icon : BsFileEarmarkBinary

  const handleClick = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .map(() =>
        createSearchParams({
          association: association ? association.name : "unsupported",
          path: file.path,
        }),
      )
      .fold((searchParams) =>
        navigate({
          pathname: "/editor",
          search: searchParams.toString(),
        }),
      ),
  )

  const handleContextMenu = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .map(({ pageX, pageY }) => ({ x: pageX, y: pageY }))
      .fold(({ x, y }) => dispatch(showContextMenu({ target: file, x, y }))),
  )

  const name =
    file.extension === ".md" ? file.readableName : `${file.readableName}${file.extension}`

  return (
    <Draggable
      draggableId={file.path}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          className={`rounded-md bg-neutral-100 dark:bg-neutral-900 z-50 transition-all duration-300 ${
            snapshot.isDragging ? "ring-2 ring-pink-500" : "rounded-none"
          }`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <ActionListItem
            style={{ paddingLeft }}
            text={name}
            Icon={Icon}
            isCurrent={isCurrent}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
          />
        </div>
      )}
    </Draggable>
  )
}
