import { MouseEvent, useState } from "react"
import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineFolder,
  AiOutlineFolderOpen,
} from "react-icons/ai"
import { BsChevronDown, BsChevronUp } from "react-icons/bs"

import DirectoryContent from "$activities/editor/components/file-explorer/directory-content"

import { useContextMenu } from "$containers/app/hooks/use-context-menu"

import ActionListItem from "$core/components/action-list/item"
import Null from "$core/components/null"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { OrdoDirectory } from "$core/types"
import { Either } from "$core/utils/either"
import { preventDefault, stopPropagation } from "$core/utils/event"
import { lazyBox } from "$core/utils/lazy-box"

type Props = {
  directory: OrdoDirectory
}

export default function Directory({ directory }: Props) {
  const dispatch = useAppDispatch()

  const [isExpanded, setIsExpanded] = useState(false)

  const { showContextMenu } = useContextMenu()

  const paddingLeft = `${directory.depth * 10}px`
  const hasChildren = directory && directory.children && directory.children.length > 0

  const OpenIcon = hasChildren ? AiFillFolderOpen : AiOutlineFolderOpen
  const ClosedIcon = hasChildren ? AiFillFolder : AiOutlineFolder
  const Icon = isExpanded ? OpenIcon : ClosedIcon

  const Chevron = isExpanded ? BsChevronDown : BsChevronUp

  const handleClick = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .fold(() => setIsExpanded((value) => !value)),
  )

  const handleContextMenu = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .map(({ pageX, pageY }) => ({ x: pageX, y: pageY }))
      .fold(({ x, y }) => dispatch(showContextMenu({ target: directory, x, y }))),
  )

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
