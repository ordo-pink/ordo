import { MouseEvent, useEffect } from "react"

import FileOrDirectory from "$activities/editor/components/file-explorer/file-or-directory"
import { closeFile } from "$activities/editor/store"

import { UsedSpace } from "$activities/user/components/used-space"
import { useContextMenu } from "$containers/app/hooks/use-context-menu"

import { OrdoButtonNeutral } from "$core/components/buttons"
import Null from "$core/components/null"
import { useActionContext } from "$core/hooks/use-action-context"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { Either } from "$core/utils/either"
import { preventDefault, stopPropagation } from "$core/utils/event"
import { lazyBox } from "$core/utils/lazy-box"

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
            key={child.raw.path}
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
