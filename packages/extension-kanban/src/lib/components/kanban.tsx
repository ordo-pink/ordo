import { IOrdoDirectory, Nullable, OrdoDirectoryPath, OrdoFilePath } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { Null, OrdoButtonNeutral, useCommands } from "@ordo-pink/react-utils"
import { useDrive } from "@ordo-pink/react-utils"
import { memo, useEffect, useState } from "react"
import { DragDropContext, Droppable, OnDragEndResponder } from "react-beautiful-dnd"
import { useTranslation } from "react-i18next"
import { BsPlusLg } from "react-icons/bs"
import Column from "./column"

type Props = {
  nodeKey?: string // TODO: Provide node and make updates on it if they happen
  directoryPath: OrdoDirectoryPath
}

const Kanban = ({ directoryPath }: Props) => {
  const drive = useDrive()
  const { t } = useTranslation("kanban")
  const { emit } = useCommands()

  const [directory, setDirectory] = useState<Nullable<IOrdoDirectory>>(null)

  useEffect(() => {
    if (!drive) return

    // TODO: Watch for directory movement and Kanban file movement for changes
    // TODO: Apply metadata updates on change
    setDirectory(OrdoDirectory.findDirectoryDeep(directoryPath, drive.root))
  }, [drive, directoryPath])

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

        emit("fs.move-file", {
          oldPath: result.draggableId,
          newPath: `${result.destination.droppableId}${file}` as OrdoFilePath,
        })
      }
    }
  }

  const translatedAddColumn = t("add-column")

  return Either.fromNullable(directory).fold(Null, (dir) => (
    <DragDropContext
      onDragEnd={onDragEnd}
      key={`${dir.path}-kanban`}
    >
      <Droppable
        droppableId={`${dir.path}-columns`}
        direction="horizontal"
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col space-y-4 md:m-4 mt-10 h-full rounded-lg bg-gradient-to-b from-slate-400 to-stone-400 dark:from-zinc-900 dark:to-stone-900 shadow-lg p-4"
          >
            <div className="h-full flex space-x-4 overflow-x-auto">
              {dir.children
                .filter((item) => OrdoDirectory.isOrdoDirectory(item))
                .map((directory, index) => {
                  return (
                    <Column
                      key={directory.path}
                      directory={directory as IOrdoDirectory<{ color: string }>}
                      index={index}
                    />
                  )
                })}
            </div>

            {provided.placeholder}

            <div className="flex self-center">
              <OrdoButtonNeutral
                center
                onClick={() => {
                  emit("fs.show-create-directory-modal", dir)
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
  ))
}

export default memo(Kanban, (prev, next) => prev.directoryPath === next.directoryPath)
