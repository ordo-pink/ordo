import { Either } from "@ordo-pink/either"
import { lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
import { Null } from "@ordo-pink/react-components"
import { MouseEvent, useEffect } from "react"
import FileOrDirectory from "./file-or-directory"
import { useContextMenu } from "../../../../containers/app/hooks/use-context-menu"
import { OrdoButtonNeutral } from "../../../../core/components/buttons"
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

  return Either.fromNullable(directory).fold(Null, (rootDirectory) => (
    <div
      className="file-explorer"
      onContextMenu={handleContextMenu}
    >
      <div className="file-explorer_files-container">
        {rootDirectory.children.map((child) => (
          <FileOrDirectory
            key={child.path}
            item={child}
          />
        ))}
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
