import { IOrdoFile, Nullable, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoFile } from "@ordo-pink/fs-entity"
import { useContextMenu, Null, useCommands } from "@ordo-pink/react-utils"
import { Draggable } from "react-beautiful-dnd"
import { BsCalendarDate, BsKanban, BsTextLeft } from "react-icons/bs"

type Props = {
  file: IOrdoFile
  index: number
}

export default function Card({ file, index }: Props) {
  const { showContextMenu } = useContextMenu()
  const { emit } = useCommands()

  return (
    <Draggable
      draggableId={file.path}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()

            showContextMenu({
              target: file,
              x: e.pageX,
              y: e.pageY,
            })
          }}
          className={`transition-all duration-300 flex flex-col space-y-4 rounded-lg p-2 focus:ring-2 focus:ring-pink-500 ${
            snapshot.isDragging
              ? "bg-gradient-to-tr from-sky-200 dark:from-violet-700 via-slate-200 to-pink-200 dark:to-purple-700"
              : "bg-neutral-100 dark:bg-neutral-800"
          }`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div>{file.readableName}</div>
          <div className="flex justify-between items-center text-xs text-neutral-500">
            <div className="flex items-center">
              {Either.fromBoolean(file.size > 0).fold(Null, () => (
                <BsTextLeft
                  onClick={() => {
                    emit("editor.open-file-in-editor", file.path)
                  }}
                  className="cursor-pointer mr-4"
                  title={OrdoFile.getReadableSize(file.size)}
                />
              ))}

              {Either.fromNullable(file.metadata["kanbans"] as OrdoDirectoryPath[]).fold(
                Null,
                (kanbans) => (
                  <div className="flex items-center space-x-2 mr-4">
                    <BsKanban className="cursor-pointer" />
                    <div>{kanbans.length}</div>
                  </div>
                ),
              )}

              {Either.fromNullable(
                file.metadata["dates"] as Nullable<{ start: Date; end: Nullable<Date> }[]>,
              ).fold(Null, (dates) => (
                <div>
                  {dates.slice(0, 3).map((date) => (
                    <div
                      className="flex items-center space-x-2 mr-4"
                      key={date.start.toString()}
                    >
                      <BsCalendarDate />
                      <div>{new Date(date.start).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {/* TODO: Display action buttons on mobile */}
            {/* <div className="flex justify-end">
              <OrdoButtonSecondary
                compact
                onClick={() =>
                  dispatch(
                    showRenameFileModal({
                      target: file,
                      parent: findParent(file, tree) as IOrdoDirectory,
                      openOnRename: false,
                    }),
                  )
                }
              >
                <BsPencilSquare />
              </OrdoButtonSecondary>

              <OrdoButtonSecondary
                compact
                onClick={() =>
                  navigate({
                    pathname: "/editor",
                    search: createSearchParams({ path: file.path }).toString(),
                  })
                }
              >
                <BsArrowsFullscreen />
              </OrdoButtonSecondary>
            </div> */}
          </div>
        </div>
      )}
    </Draggable>
  )
}
