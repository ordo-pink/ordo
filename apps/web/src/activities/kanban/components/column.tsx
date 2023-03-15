import { IOrdoDirectory, IOrdoFile, OrdoFile } from "@ordo-pink/fs-entity"
import { OrdoButtonNeutral } from "@ordo-pink/react"
import { Droppable, Draggable } from "react-beautiful-dnd"
import { BsPlus } from "react-icons/bs"
import Card from "./card"
import { showCreateFileModal } from "../../../commands/file-system/store"
import { useContextMenu } from "../../../containers/app/hooks/use-context-menu"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"

type Props = {
  directory: IOrdoDirectory
  index: number
}

export default function Column({ directory, index }: Props) {
  const dispatch = useAppDispatch()

  const { showContextMenu } = useContextMenu()

  return (
    <Draggable
      draggableId={directory.path}
      index={index}
    >
      {(provided) => (
        <div
          className="flex flex-col bg-neutral-200 shadow-sm rounded-lg max-w-sm w-96"
          {...provided.draggableProps}
          ref={provided.innerRef}
          onContextMenu={(e) => {
            dispatch(
              showContextMenu({
                target: directory,
                x: e.pageX,
                y: e.pageY,
              }),
            )
          }}
        >
          <div className="flex items-center justify-between p-2">
            <h3
              className="justify-center"
              {...provided.dragHandleProps}
            >
              {directory.readableName}
            </h3>

            <OrdoButtonNeutral
              onClick={() =>
                dispatch(showCreateFileModal({ parent: directory, openOnCreate: false }))
              }
            >
              <BsPlus className="text-xl" />
            </OrdoButtonNeutral>
          </div>
          <Droppable
            droppableId={directory.path}
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
                {directory.children
                  .filter((item) => OrdoFile.isOrdoFile(item))
                  .map((file, index) => (
                    <Card
                      key={file.path}
                      file={file as IOrdoFile}
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
