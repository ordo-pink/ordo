import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { IOrdoDirectory, OrdoDirectory, OrdoFile, OrdoFilePath } from "@ordo-pink/fs-entity"
import { Null, useWorkspaceWithSidebar } from "@ordo-pink/react"
import { memo, useEffect, useState } from "react"
import { DragDropContext, Droppable, OnDragEndResponder } from "react-beautiful-dnd"
import Column from "./column"
import { moveFile } from "../../../containers/app/store"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"

export default memo(() => {
  const Workspace = useWorkspaceWithSidebar()
  const dispatch = useAppDispatch()
  const tree = useAppSelector((state) => state.app.personalProject)
  const [state, setState] = useState<Nullable<IOrdoDirectory>>(null)

  useEffect(() => {
    if (!tree) return

    const tasks = tree.children.find((child) => child.path === "/Kanban/") as IOrdoDirectory
    setState(tasks)
  }, [tree])

  const onDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) {
      // Ignore this as it's dropped outside a droppable
      return
    }

    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
      // Ignore this as the draggable ended up in the same place as it was initially
      return
    }

    if (OrdoFile.isValidPath(result.draggableId)) {
      const parentPath = OrdoFile.getParentPath(result.draggableId)

      if (result.destination && result.destination.droppableId !== parentPath) {
        const newReadableName = OrdoFile.getReadableName(result.draggableId)
        const newExtension = OrdoFile.getFileExtension(result.draggableId)
        const file = `${newReadableName}${newExtension}`

        dispatch(
          moveFile({
            oldPath: result.draggableId,
            newPath: `${result.destination.droppableId}${file}` as OrdoFilePath,
          }),
        )
      }
    }
  }
  return Either.fromNullable(state).fold(Null, (dir) => (
    <Workspace sidebarChildren={null}>
      <DragDropContext onDragEnd={onDragEnd}>
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
                      directory={directory as IOrdoDirectory}
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
})
