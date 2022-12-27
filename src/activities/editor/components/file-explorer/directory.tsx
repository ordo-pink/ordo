import { MouseEvent, useState } from "react"
import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineFolder,
  AiOutlineFolderOpen,
} from "react-icons/ai"
import { BsChevronDown, BsChevronUp, BsFilePlus, BsFolderPlus, BsFolderX } from "react-icons/bs"

import DirectoryContent from "$activities/editor/components/file-explorer/directory-content"

import { useContextMenu } from "$containers/app/hooks/use-context-menu"
import { useCreateModal } from "$containers/app/hooks/use-create-modal"
import { useDeleteModal } from "$containers/app/hooks/use-delete-modal"

import ActionListItem from "$core/components/action-list/item"
import Null from "$core/components/null"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { OrdoDirectory } from "$core/types"
import { Either } from "$core/utils/either"
import { noOp } from "$core/utils/no-op"

type Props = {
  directory: OrdoDirectory
}

export default function Directory({ directory }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const dispatch = useAppDispatch()

  const { showContextMenu } = useContextMenu()
  const { showCreateFileModal, showCreateDirectoryModal } = useCreateModal()
  const { showDeleteDirectoryModal } = useDeleteModal()

  const paddingLeft = `${directory.depth * 10}px`
  const hasChildren = directory && directory.children && directory.children.length > 0

  const OpenIcon = hasChildren ? AiFillFolderOpen : AiOutlineFolderOpen
  const ClosedIcon = hasChildren ? AiFillFolder : AiOutlineFolder
  const Icon = isExpanded ? OpenIcon : ClosedIcon

  const Chevron = isExpanded ? BsChevronDown : BsChevronUp

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
      {
        action: () => void dispatch(showDeleteDirectoryModal(directory)),
        Icon: BsFolderX,
        title: "@ordo-activity-editor/remove",
        accelerator: "ctrl+backspace",
      },
    ],
  }

  const handleClick = (event: MouseEvent) =>
    Either.of(event)
      .tap((e) => e.preventDefault())
      .tap((e) => e.stopPropagation())
      .fold(noOp, () => setIsExpanded((value) => !value))

  const handleContextMenu = (event: MouseEvent) =>
    Either.of(event)
      .tap((e) => e.preventDefault())
      .tap((e) => e.stopPropagation())
      .fold(noOp, () => dispatch(showContextMenu({ event, target: directory, structure })))

  return Either.fromNullable(directory).fold(Null, (directory) => (
    <ActionListItem
      style={{ paddingLeft }}
      text={directory.readableName}
      Icon={Icon}
      onClick={handleClick}
      isCurrent={false}
      onContextMenu={handleContextMenu}
    >
      <Chevron className="shrink-0" />
      <DirectoryContent
        directory={directory}
        isExpanded={isExpanded}
      />
    </ActionListItem>
  ))
}
