import { MouseEvent, useState } from "react"
import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineFolder,
  AiOutlineFolderOpen,
} from "react-icons/ai"
import { BsChevronDown, BsChevronUp, BsFilePlus, BsFolderPlus, BsFolderX } from "react-icons/bs"
import FileOrDirectory from "$activities/editor/components/file-explorer/file-or-directory"
import ActionListItem from "$core/components/action-list/item"
import Null from "$core/components/null"
import { OrdoDirectory } from "$core/types"
import { Either } from "$core/utils/either"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch.hook"
import { showContextMenu } from "$containers/app/hooks/use-context-menu/store"
import {
  showCreateDirectoryModal,
  showCreateFileModal,
} from "$containers/app/components/create-modal/store"

type Props = {
  item: OrdoDirectory
}

export default function Directory({ item }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const dispatch = useAppDispatch()

  const paddingLeft = `${item.depth * 10}px`
  const hasChildren = item && item.children && item.children.length > 0

  const OpenIcon = hasChildren ? AiFillFolderOpen : AiOutlineFolderOpen
  const ClosedIcon = hasChildren ? AiFillFolder : AiOutlineFolder
  const Icon = isExpanded ? OpenIcon : ClosedIcon
  const Chevron = isExpanded ? BsChevronDown : BsChevronUp

  const structure = {
    children: [
      {
        action: () => dispatch(showCreateFileModal(item)),
        Icon: BsFilePlus,
        title: "@ordo-activity-editor/create-file",
        accelerator: "ctrl+n",
      },
      {
        // TODO: Support for providing path prefix to create modal
        action: () => dispatch(showCreateDirectoryModal(item)),
        Icon: BsFolderPlus,
        title: "@ordo-activity-editor/create-directory",
        accelerator: "ctrl+shift+n",
      },
      {
        action: () => console.log("TODO"),
        Icon: BsFolderX,
        title: "@ordo-activity-editor/remove",
        accelerator: "ctrl+backspace",
      },
    ],
  }

  const handleClick = () => setIsExpanded((value) => !value)

  const handleContextMenu = (event: MouseEvent) =>
    Either.of(event)
      .tap((e) => e.preventDefault())
      .tap((e) => e.stopPropagation())
      .map(() =>
        dispatch(
          showContextMenu({
            event,
            target: item,
            structure,
          }),
        ),
      )

  return Either.fromNullable(item).fold(Null, (directory) => (
    <ActionListItem
      style={{ paddingLeft }}
      text={directory.readableName}
      Icon={Icon}
      onClick={handleClick}
      isCurrent={false}
      onContextMenu={handleContextMenu}
    >
      <Chevron className="shrink-0" />
      {Either.fromBoolean(isExpanded).fold(Null, () =>
        directory.children.map((child) => (
          <FileOrDirectory
            key={child.path}
            item={child}
          />
        )),
      )}
    </ActionListItem>
  ))
}
