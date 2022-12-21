import { useState } from "react"
import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineFolder,
  AiOutlineFolderOpen,
} from "react-icons/ai"
import { BsChevronDown, BsChevronUp } from "react-icons/bs"
import FileOrDirectory from "$activities/editor/components/file-explorer/file-or-directory"
import ActionListItem from "$core/components/action-list/item"
import Null from "$core/components/null"
import { OrdoDirectory } from "$core/types"
import { Either } from "$core/utils/either"

type Props = {
  item: OrdoDirectory
}

export default function Directory({ item }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const paddingLeft = `${item.depth * 10}px`
  const hasChildren = item && item.children && item.children.length > 0

  const OpenIcon = hasChildren ? AiFillFolderOpen : AiOutlineFolderOpen
  const ClosedIcon = hasChildren ? AiFillFolder : AiOutlineFolder
  const Icon = isExpanded ? OpenIcon : ClosedIcon
  const Chevron = isExpanded ? BsChevronDown : BsChevronUp

  const handleClick = () => setIsExpanded((value) => !value)

  return Either.fromNullable(item).fold(Null, (directory) => (
    <ActionListItem
      style={{ paddingLeft }}
      text={directory.readableName}
      Icon={Icon}
      onClick={handleClick}
      isCurrent={false}
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
