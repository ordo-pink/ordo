import { IOrdoDirectory, IOrdoFile, OrdoFile } from "@ordo-pink/fs-entity"
import { OrdoButtonSecondary } from "@ordo-pink/react"
import { Droppable, Draggable } from "react-beautiful-dnd"
import { BsPencilSquare, BsPlus } from "react-icons/bs"
import Card from "./card"
import { backgroundColors } from "../../../commands/colors/colors"
import { showCreateFileModal, showRenameDirectoryModal } from "../../../commands/file-system/store"
import { useContextMenu } from "../../../containers/app/hooks/use-context-menu"
import { useAppDispatch } from "../../../core/state/hooks/use-app-dispatch"
import { useAppSelector } from "../../../core/state/hooks/use-app-selector"
import { findParent } from "../../../core/utils/fs-helpers"

type Props = {
  directory: IOrdoDirectory<{ color: string }>
  index: number
}

export default function Column({ directory, index }: Props) {
  const dispatch = useAppDispatch()

  const tree = useAppSelector((state) => state.app.personalProject)
  const color = directory.metadata.color ?? "neutral"

  const { showContextMenu } = useContextMenu()

  return (
    <Draggable
      draggableId={`${directory.path}-cards`}
      index={index}
    >
      {(provided) => (
        <div
          className={`flex flex-col ${
            backgroundColors[color] ?? backgroundColors.neutral
          } shadow-sm rounded-lg min-w-[calc(100vw-8.75rem)] md:min-w-[200px] w-96 max-w-xs`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
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
          <div className="flex flex-col md:flex-row items-center justify-between p-2">
            <h3 className="justify-center font-extrabold">{directory.readableName}</h3>

            <div className="flex space-x-2">
              <OrdoButtonSecondary
                compact
                onClick={() =>
                  dispatch(showCreateFileModal({ parent: directory, openOnCreate: false }))
                }
              >
                <BsPlus className="text-xl text-neutral-900 dark:text-neutral-100" />
              </OrdoButtonSecondary>

              <OrdoButtonSecondary
                compact
                onClick={() =>
                  dispatch(
                    showRenameDirectoryModal({
                      parent: findParent(directory, tree) as IOrdoDirectory,
                      target: directory,
                    }),
                  )
                }
              >
                <BsPencilSquare className="text-neutral-900 dark:text-neutral-100" />
              </OrdoButtonSecondary>
            </div>
          </div>
          <Droppable
            droppableId={directory.path}
            type="task"
          >
            {(provided, snapshot) => (
              <div
                className={`flex flex-col space-y-2 flex-grow min-h-min p-2 rounded-b-lg overflow-y-auto ${
                  snapshot.isDraggingOver
                    ? "bg-neutral-300 dark:bg-zinc-700"
                    : backgroundColors[color] ?? backgroundColors.neutral
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
