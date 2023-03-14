import { IOrdoDirectory, IOrdoFile, OrdoFile } from "@ordo-pink/fs-entity"
import { Droppable, Draggable } from "react-beautiful-dnd"
import Task from "./task"

type Props = {
  column: IOrdoDirectory
  index: number
}

export default function Column({ column, index }: Props) {
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
          <h3
            className="justify-center p-2"
            {...provided.dragHandleProps}
          >
            {column.readableName}
          </h3>
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
