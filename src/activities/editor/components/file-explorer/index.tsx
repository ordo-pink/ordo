import { MouseEvent } from "react"
import { BsFilePlus, BsFolderPlus } from "react-icons/bs"

import FileOrDirectory from "$activities/editor/components/file-explorer/file-or-directory"

import { useContextMenu } from "$containers/app/hooks/use-context-menu"
import { useCreateModal } from "$containers/app/hooks/use-create-modal"

import item from "$core/components/action-list/item"
import { OrdoButtonNeutral } from "$core/components/buttons"
import Null from "$core/components/null"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { Either } from "$core/utils/either"
import { noOp } from "$core/utils/no-op"

export default function FileExplorer() {
  const dispatch = useAppDispatch()

  const directory = useAppSelector((state) => state.app.personalProject)

  const { showContextMenu } = useContextMenu()
  const { showCreateFileModal, showCreateDirectoryModal } = useCreateModal()

  const structure = {
    children: [
      {
        action: () => void dispatch(showCreateFileModal(directory)),
        Icon: BsFilePlus,
        title: "@ordo-activity-editor/create-file",
        accelerator: "ctrl+n",
      },
      {
        action: () => void dispatch(showCreateDirectoryModal(directory)),
        Icon: BsFolderPlus,
        title: "@ordo-activity-editor/create-directory",
        accelerator: "ctrl+shift+n",
      },
    ],
  }

  const handleContextMenu = (event: MouseEvent) =>
    Either.of(event)
      .tap((event) => event.preventDefault())
      .tap((event) => event.stopPropagation())
      .fold(noOp, () => dispatch(showContextMenu({ event, target: item, structure })))

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
        <OrdoButtonNeutral onClick={() => dispatch(showCreateFileModal(directory))}>
          <div className="flex items-center md:space-x-2">
            <BsFilePlus />
          </div>
        </OrdoButtonNeutral>
        <OrdoButtonNeutral onClick={() => dispatch(showCreateDirectoryModal(directory))}>
          <div className="flex items-center md:space-x-2">
            <BsFolderPlus />
          </div>
        </OrdoButtonNeutral>
      </div>
    </div>
  ))
}
