/* eslint-disable react/require-render-return */
import { IOrdoFile } from "@ordo-pink/fs-entity"
import { Draggable } from "react-beautiful-dnd"

type Props = {
  task: IOrdoFile
  index: number
}

export default function Task({ task, index }: Props) {
  return (
    <Draggable
      draggableId={task.path}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          className={`transition-all duration-300 flex items-center justify-between rounded-lg p-2 shadow-sm ${
            snapshot.isDragging
              ? "bg-gradient-to-tr from-sky-200 via-slate-200 to-pink-200"
              : "bg-neutral-100"
          }`}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div>{task.readableName}</div>
        </div>
      )}
    </Draggable>
  )
}
