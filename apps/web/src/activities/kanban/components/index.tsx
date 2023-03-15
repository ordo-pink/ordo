import { Nullable } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { IOrdoDirectory, OrdoDirectory, OrdoFile, OrdoFilePath } from "@ordo-pink/fs-entity"
import { Null, OrdoButtonNeutral, useWorkspaceWithSidebar } from "@ordo-pink/react"
import { memo, useEffect, useState } from "react"
import { DragDropContext, Droppable, OnDragEndResponder } from "react-beautiful-dnd"
import { useTranslation } from "react-i18next"
import { BsPlusLg } from "react-icons/bs"
import Column from "./column"
import { showCreateDirectoryModal } from "../../../commands/file-system/store"
import { moveFile } from "../../../containers/app/store"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"

export default memo(() => {
  const Workspace = useWorkspaceWithSidebar()
  const dispatch = useAppDispatch()
  const tree = useAppSelector((state) => state.app.personalProject)
  const [state, setState] = useState<Nullable<IOrdoDirectory>>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (!tree) return

    const tasks = tree.children.find((child) => child.path === "/Kanban/") as IOrdoDirectory
    setState(tasks)
  }, [tree])

  const translatedAddColumn = t("@ordo-activity-kanban/add-column")

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
            <div className="flex flex-col space-y-4 m-4 mt-10 h-full rounded-lg bg-gradient-to-b from-slate-400 to-stone-400 dark:from-slate-800 dark:to-stone-900 shadow-lg p-4">
              <div
                className="flex justify-center space-x-4"
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

              <div className="flex self-center">
                <OrdoButtonNeutral
                  center
                  onClick={() => {
                    if (!state) return

                    dispatch(showCreateDirectoryModal(state))
                  }}
                >
                  <div className="flex space-x-2 items-center">
                    <BsPlusLg />
                    <div className="text-lg">{translatedAddColumn}</div>
                  </div>
                </OrdoButtonNeutral>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Workspace>
  ))
})
