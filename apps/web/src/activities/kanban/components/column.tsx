import { IOrdoDirectory, IOrdoFile, OrdoFile } from "@ordo-pink/fs-entity"
import { OrdoButtonNeutral } from "@ordo-pink/react"
import { Droppable, Draggable } from "react-beautiful-dnd"
import { BsPlus } from "react-icons/bs"
import Task from "./task"
import { showCreateFileModal } from "../../../commands/file-system/store"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"

type Props = {
  column: IOrdoDirectory
  index: number
}

export default function Column({ column, index }: Props) {
  const dispatch = useAppDispatch()

  return (
    <Draggable
      draggableId={column.path}
      index={index}
    >
      {(provided) => (
        <div
          className="flex flex-col bg-neutral-200 shadow-sm rounded-lg max-w-sm w-96"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="flex items-center justify-between p-2">
            <h3
              className="justify-center"
              {...provided.dragHandleProps}
            >
              {column.readableName}
            </h3>

            <OrdoButtonNeutral onClick={() => dispatch(showCreateFileModal(column))}>
              <BsPlus className="text-xl" />
            </OrdoButtonNeutral>
          </div>
          <Droppable
            droppableId={column.path}
            type="task"
          >
            {(provided, snapshot) => (
              <div
                className={`flex flex-col space-y-2 flex-grow min-h-min p-2 rounded-b-lg ${
                  snapshot.isDraggingOver ? "bg-neutral-300" : "bg-neutral-200"
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {column.children
                  .filter((item) => OrdoFile.isOrdoFile(item))
                  .map((task, index) => (
                    <Task
                      key={task.path}
                      task={task as IOrdoFile}
                      index={index}
                    />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}
