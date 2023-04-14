import { IOrdoDirectory, Nullable, OrdoDirectoryPath, OrdoFilePath } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { Null, OrdoButtonNeutral, useCommands } from "@ordo-pink/react-utils"
import { useDrive } from "@ordo-pink/react-utils"
import { createDraft, finishDraft } from "immer"
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

    if (
      directory &&
      OrdoDirectory.isValidPath(result.draggableId) &&
      result.destination.droppableId === `${directoryPath}columns`
    ) {
      const draft = createDraft(directory)

      if (!draft.metadata.childOrder) {
        draft.metadata.childOrder = directory.children.map((child) => child.path)
      }

      const order = draft.metadata.childOrder as (OrdoDirectoryPath | OrdoFilePath)[]

      order.splice(order.indexOf(result.draggableId), 1)
      order.splice(result.destination.index, 0, result.draggableId)

      emit("fs.update-directory", finishDraft(draft))
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
      key={`${dir.path}kanban`}
    >
      <Droppable
        droppableId={`${dir.path}columns`}
        direction="horizontal"
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col space-y-4 mt-10 h-full"
          >
            <div className="h-full flex space-x-4 overflow-x-auto pb-6 px-2">
              {dir.metadata.childOrder
                ? dir.metadata.childOrder
                    .filter((child) => OrdoDirectory.isValidPath(child))
                    .map((child, index) =>
                      Either.fromNullable(
                        OrdoDirectory.findDirectoryDeep(child as OrdoDirectoryPath, dir),
                      ).fold(Null, (column) => (
                        <Column
                          key={child}
                          directory={column}
                          index={index}
                        />
                      )),
                    )
                : dir.children
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
