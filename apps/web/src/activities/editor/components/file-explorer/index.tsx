import { OrdoFilePath, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { Null, OrdoButtonNeutral } from "@ordo-pink/react-utils"
import { MouseEvent, useEffect } from "react"
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
  OnDragStartResponder,
  OnDragUpdateResponder,
} from "react-beautiful-dnd"
import FileOrDirectory from "./file-or-directory"
import { useContextMenu } from "../../../../containers/app/hooks/use-context-menu"
import { moveDirectory, moveFile } from "../../../../containers/app/store"
import { useActionContext } from "../../../../core/hooks/use-action-context"
import { useAppDispatch } from "../../../../core/state/hooks/use-app-dispatch"
import { useAppSelector } from "../../../../core/state/hooks/use-app-selector"
import { UsedSpace } from "../../../user/components/used-space"
import { closeFile } from "../../store"

export default function FileExplorer() {
  const dispatch = useAppDispatch()

  const directory = useAppSelector((state) => state.app.personalProject)
  const commands = useAppSelector((state) => state.app.commands)

  useEffect(
    () => () => {
      dispatch(closeFile())
    },
    [dispatch],
  )

  const { showContextMenu } = useContextMenu()

  const actionContext = useActionContext(directory)

  const createFileCommand = commands.find(
    (command) => command.title === "@ordo-command-file-system/create-file",
  )
  const createDirectoryCommand = commands.find(
    (command) => command.title === "@ordo-command-file-system/create-directory",
  )

  const CreateFileIcon = createFileCommand ? createFileCommand.Icon : () => null
  const CreateDirectoryIcon = createDirectoryCommand ? createDirectoryCommand.Icon : () => null

  const handleContextMenu = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .map(({ pageX, pageY }) => ({ x: pageX, y: pageY }))
      .fold(({ x, y }) => dispatch(showContextMenu({ target: directory, x, y }))),
  )

  const handleCreateFileClick = lazyBox((box) =>
    box.map(() => actionContext).fold((ctx) => createFileCommand && createFileCommand.action(ctx)),
  )

  const handleCreateDirectoryClick = lazyBox((box) =>
    box
      .map(() => actionContext)
      .fold((ctx) => createDirectoryCommand && createDirectoryCommand.action(ctx)),
  )

  const handleDragStart: OnDragStartResponder = () => {
    // TODO: Collapse directories
  }

  const handleDragUpdate: OnDragUpdateResponder = () => {
    // TODO: Expand directory when hovering over it
  }

  const handleDragEnd: OnDragEndResponder = (result, provided) => {
    if (OrdoFile.isValidPath(result.draggableId)) {
      const parentPath = OrdoFile.getParentPath(result.draggableId)

      if (result.destination && result.destination?.droppableId !== parentPath) {
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
    } else if (OrdoDirectory.isValidPath(result.draggableId)) {
      const parentPath = OrdoDirectory.getParentPath(result.draggableId)

      if (
        result.destination &&
        result.destination?.droppableId !== parentPath &&
        result.draggableId !== result.destination.droppableId
      ) {
        const directory = OrdoDirectory.getReadableName(result.draggableId)

        dispatch(
          moveDirectory({
            oldPath: result.draggableId,
            newPath: `${result.destination.droppableId}${directory}/` as OrdoDirectoryPath,
          }),
        )
      }
    }
  }

  return Either.fromNullable(directory).fold(Null, (rootDirectory) => (
    <div
      className="file-explorer"
      onContextMenu={handleContextMenu}
    >
      <div className="file-explorer_files-container">
        <DragDropContext
          onDragStart={handleDragStart}
          onDragUpdate={handleDragUpdate}
          onDragEnd={handleDragEnd}
        >
          <Droppable droppableId={rootDirectory.path}>
            {(provided, snapshot) => (
              <div
                className={`h-full transition-all duration-300  ${
                  snapshot.isDraggingOver ? "bg-neutral-200 dark:bg-neutral-800" : ""
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {rootDirectory.children.map((child, index) => (
                  <FileOrDirectory
                    key={child.path}
                    index={index}
                    item={child}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <UsedSpace />
      <div className="file-explorer_action-group">
        <OrdoButtonNeutral onClick={handleCreateFileClick}>
          <div>
            <CreateFileIcon />
          </div>
        </OrdoButtonNeutral>
        <OrdoButtonNeutral onClick={handleCreateDirectoryClick}>
          <div>
            <CreateDirectoryIcon />
          </div>
        </OrdoButtonNeutral>
      </div>
    </div>
  ))
}
