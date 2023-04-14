import { IOrdoDirectory, IOrdoFile } from "@ordo-pink/common-types"
import { OrdoFile } from "@ordo-pink/fs-entity"
import {
  useContextMenu,
  OrdoButtonSecondary,
  useCommands,
  useFileAssociationFor,
} from "@ordo-pink/react-utils"
import { Droppable, Draggable } from "react-beautiful-dnd"
import { BsPencilSquare, BsPlus } from "react-icons/bs"
import Card from "./card"
import ImageCard from "./image-card"
import { backgroundColors } from "../colors"

type Props = {
  directory: IOrdoDirectory
  index: number
}

export default function Column({ directory, index }: Props) {
  const color = directory.metadata.color ?? "neutral"

  const { showContextMenu } = useContextMenu()
  const { emit } = useCommands()

  return (
    <Draggable
      draggableId={`${directory.path}`}
      index={index}
    >
      {(provided) => (
        <div
          className={`flex flex-col h-full ${
            backgroundColors[color] ?? backgroundColors["neutral"]
          } shadow-lg rounded-lg min-w-[calc(100vw-6.5rem)] sm:min-w-[16rem] w-64 max-w-xs`}
          {...provided.draggableProps}
          ref={provided.innerRef}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()

            showContextMenu({
              target: directory,
              x: e.pageX,
              y: e.pageY,
            })
          }}
        >
          <div
            className="flex flex-col md:flex-row items-center justify-between p-2"
            {...provided.dragHandleProps}
          >
            <h3 className="justify-center font-extrabold">{directory.readableName}</h3>

            <div className="flex space-x-2">
              <OrdoButtonSecondary
                compact
                onClick={() => emit("fs.show-create-file-modal", { parent: directory })}
              >
                <BsPlus className="text-xl text-neutral-900 dark:text-neutral-100" />
              </OrdoButtonSecondary>

              <OrdoButtonSecondary
                compact
                onClick={() => emit("fs.show-rename-directory-modal", directory)}
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
                    ? "bg-neutral-300 dark:bg-zinc-600"
                    : backgroundColors[color] ?? backgroundColors["neutral"]
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {directory.metadata.childOrder
                  ? directory.metadata.childOrder
                      .filter((item) => OrdoFile.isValidPath(item))
                      .map((path, index) => {
                        const file = directory.children.find((child) => child.path === path)

                        if (!file) return null

                        const association = useFileAssociationFor(file as IOrdoFile)

                        return association && association.name === "editor.img" ? (
                          <ImageCard
                            key={file.path}
                            file={file as IOrdoFile}
                            index={index}
                          />
                        ) : (
                          <Card
                            key={file.path}
                            file={file as IOrdoFile}
                            index={index}
                          />
                        )
                      })
                  : directory.children
                      .filter((item) => OrdoFile.isOrdoFile(item))
                      .map((file, index) => {
                        const association = useFileAssociationFor(file as IOrdoFile)

                        return association && association.name === "editor.img" ? (
                          <ImageCard
                            key={file.path}
                            file={file as IOrdoFile}
                            index={index}
                          />
                        ) : (
                          <Card
                            key={file.path}
                            file={file as IOrdoFile}
                            index={index}
                          />
                        )
                      })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}
