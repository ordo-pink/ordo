import { Either } from "@ordo-pink/either"
// import { lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
import { Null, useContextMenu, useDrive } from "@ordo-pink/react-utils"
import { memo, MouseEvent } from "react"
import FileOrDirectory from "./file-or-directory"
// import { useContextMenu } from "../../../../containers/app/hooks/use-context-menu"
// import { useActionContext } from "../../../../core/hooks/use-action-context"
// import { useAppDispatch } from "../../../../core/state/hooks/use-app-dispatch"
// import { useAppSelector } from "../../../../core/state/hooks/use-app-selector"
// import { UsedSpace } from "../../../user/components/used-space"
// import { closeFile } from "../../store"

function FileExplorer() {
  const drive = useDrive()
  const { showContextMenu } = useContextMenu()
  // const dispatch = useAppDispatch()

  // const directory = useAppSelector((state) => state.app.personalProject)
  // const commands = useAppSelector((state) => state.app.commands)

  // useEffect(
  //   () => () => {
  //     dispatch(closeFile())
  //   },
  //   [dispatch],
  // )

  // const { showContextMenu } = useContextMenu()

  // const actionContext = useActionContext(directory)

  // const createFileCommand = commands.find(
  //   (command) => command.title === "@ordo-command-file-system/create-file",
  // )
  // const createDirectoryCommand = commands.find(
  //   (command) => command.title === "@ordo-command-file-system/create-directory",
  // )

  // const CreateFileIcon = createFileCommand ? createFileCommand.Icon : () => null
  // const CreateDirectoryIcon = createDirectoryCommand ? createDirectoryCommand.Icon : () => null

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!drive) return

    showContextMenu({ x: event.pageX, y: event.pageY, target: drive.root })
  }

  // const handleCreateFileClick = lazyBox((box) =>
  //   box.map(() => actionContext).fold((ctx) => createFileCommand && createFileCommand.action(ctx)),
  // )

  // const handleCreateDirectoryClick = lazyBox((box) =>
  //   box
  //     .map(() => actionContext)
  //     .fold((ctx) => createDirectoryCommand && createDirectoryCommand.action(ctx)),
  // )

  return Either.fromNullable(drive).fold(Null, ({ root }) => (
    <div
      className="p-4 h-full"
      onContextMenu={handleContextMenu}
    >
      <div className="file-explorer_files-container">
        <div className={`h-full transition-all duration-300`}>
          {root.children.map((child, index) => (
            <FileOrDirectory
              key={child.path}
              index={index}
              item={child}
            />
          ))}
        </div>
      </div>
      {/* <UsedSpace />
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
      </div> */}
    </div>
  ))
}

export default memo(FileExplorer, () => true)
