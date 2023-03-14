import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { IOrdoDirectory, OrdoDirectory } from "@ordo-pink/fs-entity"
import { Null, useWorkspaceWithSidebar } from "@ordo-pink/react"
import { useEffect, useState } from "react"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import Column from "./column"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"

export default function Kanban() {
  const Workspace = useWorkspaceWithSidebar()
  const [state, setState] = useState<Nullable<IOrdoDirectory>>(null)
  const tree = useAppSelector((state) => state.app.personalProject)

  useEffect(() => {
    if (!tree) return

    const tasks = tree.children.find((child) => child.path === "/Kanban/") as IOrdoDirectory
    setState(tasks)
  }, [tree])

  // TODO: Moving files
  // TODO: Persist child order in directory
  // TODO: Adding cards (reuse create modal)
  // TODO: Removing cards
  // TODO: Removing columns
  // TODO: Adding columns (reuse create modal)
  // TODO: Opening cards
  // TODO: Display metadata
  // TODO: Renaming cards
  // TODO: Kanban for Editor

  // const onDragEnd = (result: any) => {
  //   const { destination, source, draggableId, type } = result

  //   if (!destination) {
  //     return
  //   }
  //   if (destination.droppableId === source.droppableId && destination.index === source.index) {
  //     return
  //   }

  //   if (type === "column") {
  //     const newColumnOrder = Array.from(state.columnOrder)
  //     newColumnOrder.splice(source.index, 1)
  //     newColumnOrder.splice(destination.index, 0, draggableId)
  //     const newState = {
  //       ...state,
  //       columnOrder: newColumnOrder,
  //     }
  //     setState(newState)
  //     return
  //   }

  //   const start = state.columns[source.droppableId]
  //   const finish = state.columns[destination.droppableId]

  //   if (start === finish) {
  //     const newTaskIds = Array.from(start.taskIds)

  //     newTaskIds.splice(source.index, 1)
  //     newTaskIds.splice(destination.index, 0, draggableId)

  //     const newColumn = {
  //       ...start,
  //       taskIds: newTaskIds,
  //     }

  //     const newState = {
  //       ...state,
  //       columns: {
  //         ...state.columns,
  //         [newColumn.id]: newColumn,
  //       },
  //     }
  //     setState(newState)
  //     return
  //   }

  //   const startTaskIds = Array.from(start.taskIds)
  //   startTaskIds.splice(source.index, 1)
  //   const newStart = {
  //     ...start,
  //     taskIds: startTaskIds,
  //   }

  //   const finishTaskIds = Array.from(finish.taskIds)
  //   finishTaskIds.splice(destination.index, 0, draggableId)
  //   const newFinish = {
  //     ...finish,
  //     taskIds: finishTaskIds,
  //   }
  //   const newState = {
  //     ...state,
  //     columns: {
  //       ...state.columns,
  //       [newStart.id]: newStart,
  //       [newFinish.id]: newFinish,
  //     },
  //   }
  //   setState(newState)
  // }
  // onDragEnd={onDragEnd}
  return Either.fromNullable(state).fold(Null, (dir) => (
    <Workspace sidebarChildren={null}>
      <DragDropContext onDragEnd={() => void null}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              className="flex justify-center p-4 mt-10 space-x-4 h-full"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {dir.children
                .filter((item) => OrdoDirectory.isOrdoDirectory(item))
                .map((directory, index) => {
                  return (
                    <Column
                      key={directory.path}
                      column={directory as IOrdoDirectory}
                      index={index}
                    />
                  )
                })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Workspace>
  ))
}
