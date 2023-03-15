/* eslint-disable react/require-render-return */
import { IOrdoDirectory, IOrdoFile } from "@ordo-pink/fs-entity"
import { OrdoButtonSecondary } from "@ordo-pink/react"
import { Draggable } from "react-beautiful-dnd"
import { BsArrowsFullscreen, BsPencilSquare } from "react-icons/bs"
import { createSearchParams, useNavigate } from "react-router-dom"
import { showRenameFileModal } from "../../../commands/file-system/store"
import { useContextMenu } from "../../../containers/app/hooks/use-context-menu"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"
import { findParent } from "../../../core/utils/fs-helpers"

type Props = {
  file: IOrdoFile
  index: number
}

export default function Card({ file, index }: Props) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { showContextMenu } = useContextMenu()

  const tree = useAppSelector((state) => state.app.personalProject)

  return (
    <Draggable
      draggableId={file.path}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()

            dispatch(
              showContextMenu({
                target: file,
                x: e.pageX,
                y: e.pageY,
              }),
            )
          }}
          className={`transition-all duration-300 flex flex-col space-y-4 rounded-lg p-2 shadow-sm ${
            snapshot.isDragging
              ? "bg-gradient-to-tr from-sky-200 via-slate-200 to-pink-200"
              : "bg-neutral-100"
          }`}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div>{file.readableName}</div>
          <div className="flex justify-end">
            <OrdoButtonSecondary
              compact
              onClick={() =>
                dispatch(
                  showRenameFileModal({
                    target: file,
                    parent: findParent(file, tree) as IOrdoDirectory,
                    openOnRename: false,
                  }),
                )
              }
            >
              <BsPencilSquare />
            </OrdoButtonSecondary>

            <OrdoButtonSecondary
              compact
              onClick={() =>
                navigate({
                  pathname: "/editor",
                  search: createSearchParams({ path: file.path }).toString(),
                })
              }
            >
              <BsArrowsFullscreen />
            </OrdoButtonSecondary>
          </div>
        </div>
      )}
    </Draggable>
  )
}
