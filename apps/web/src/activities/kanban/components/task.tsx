/* eslint-disable react/require-render-return */
import { IOrdoFile } from "@ordo-pink/fs-entity"
import { OrdoButtonSecondary } from "@ordo-pink/react"
import { Draggable } from "react-beautiful-dnd"
import { BsArrowsFullscreen } from "react-icons/bs"
import { createSearchParams, useNavigate } from "react-router-dom"

type Props = {
  task: IOrdoFile
  index: number
}

export default function Task({ task, index }: Props) {
  const navigate = useNavigate()

  return (
    <Draggable
      draggableId={task.path}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          className={`transition-all duration-300 flex flex-col space-y-4 rounded-lg p-2 shadow-sm ${
            snapshot.isDragging
              ? "bg-gradient-to-tr from-sky-200 via-slate-200 to-pink-200"
              : "bg-neutral-100"
          }`}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div>{task.readableName}</div>
          <div className="flex space-x-2 justify-end">
            <OrdoButtonSecondary
              compact
              onClick={() =>
                navigate({
                  pathname: "/editor",
                  search: createSearchParams({ path: task.path }).toString(),
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
