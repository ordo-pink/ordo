/* eslint-disable react/require-render-return */
import { IOrdoFile } from "@ordo-pink/fs-entity"
import { Draggable } from "react-beautiful-dnd"
import { RxDragHandleDots2 } from "react-icons/rx"

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
          className={`flex items-center justify-between rounded-lg p-2 shadow-sm ${
            snapshot.isDragging ? "bg-gradient-to-tr from-sky-200 to-pink-200" : "bg-neutral-100"
          }`}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div>{task.readableName}</div>
          <div
            className=""
            {...provided.dragHandleProps}
          >
            <RxDragHandleDots2 />
          </div>
        </div>
      )}
    </Draggable>
  )
}
