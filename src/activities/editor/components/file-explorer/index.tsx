import { MouseEvent } from "react"
import { BsFilePlus, BsFolderPlus } from "react-icons/bs"

import FileOrDirectory from "$activities/editor/components/file-explorer/file-or-directory"

import { useContextMenu } from "$containers/app/hooks/use-context-menu"

import { OrdoButtonNeutral } from "$core/components/buttons"
import Null from "$core/components/null"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { Either } from "$core/utils/either"
import { noOp } from "$core/utils/no-op"

export default function FileExplorer() {
  const dispatch = useAppDispatch()

  const directory = useAppSelector((state) => state.app.personalProject)
  const commands = useAppSelector((state) => state.app.commands)
  const state = useAppSelector((state) => state)

  const createFileCommand = commands.find(
    (command) => command.title === "@ordo-command-create-file-or-directory/create-file",
  )

  const createDirectoryCommand = commands.find(
    (command) => command.title === "@ordo-command-create-file-or-directory/create-directory",
  )

  const { showContextMenu } = useContextMenu()

  const handleContextMenu = (event: MouseEvent) =>
    Either.of(event)
      .tap((event) => event.preventDefault())
      .tap((event) => event.stopPropagation())
      .fold(noOp, ({ pageX, pageY }) =>
        dispatch(showContextMenu({ target: directory, x: pageX, y: pageY })),
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

      <div className="file-explorer_action-group">
        <OrdoButtonNeutral
          onClick={() =>
            createFileCommand &&
            createFileCommand.action({
              contextMenuTarget: directory,
              currentFile: null,
              dispatch,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              env: {} as any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              state: state as any,
            })
          }
        >
          <div className="flex items-center md:space-x-2">
            <BsFilePlus />
          </div>
        </OrdoButtonNeutral>
        <OrdoButtonNeutral
          onClick={() =>
            // TODO: Extract action call preparation to a hook
            createDirectoryCommand &&
            createDirectoryCommand.action({
              contextMenuTarget: directory,
              currentFile: null,
              dispatch,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              env: {} as any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              state: state as any,
            })
          }
        >
          <div className="flex items-center md:space-x-2">
            <BsFolderPlus />
          </div>
        </OrdoButtonNeutral>
      </div>
    </div>
  ))
}
