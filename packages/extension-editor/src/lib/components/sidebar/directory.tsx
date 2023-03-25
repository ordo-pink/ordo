import { IOrdoDirectory } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { ActionListItem, Null, useCommands, useContextMenu } from "@ordo-pink/react-utils"
import { MouseEvent } from "react"
import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineFolder,
  AiOutlineFolderOpen,
} from "react-icons/ai"
import { BsChevronDown, BsChevronUp } from "react-icons/bs"
import DirectoryContent from "./directory-content"
import { iconColors } from "../../colors"

type Props = {
  directory: IOrdoDirectory<{ isExpanded: boolean; color: string }>
}

export default function Directory({ directory }: Props) {
  const { emit } = useCommands()

  const { showContextMenu } = useContextMenu()

  const depth = directory.path.slice(1, -1).split("/").filter(Boolean).length

  const paddingLeft = `${depth * 10}px`
  const hasChildren = directory && directory.children && directory.children.length > 0

  const OpenIcon = hasChildren ? AiFillFolderOpen : AiOutlineFolderOpen
  const ClosedIcon = hasChildren ? AiFillFolder : AiOutlineFolder
  const Icon = directory.metadata.isExpanded
    ? () => <OpenIcon className={iconColors[directory.metadata.color] ?? iconColors["neutral"]} />
    : () => <ClosedIcon className={iconColors[directory.metadata.color] ?? iconColors["neutral"]} />

  const Chevron = directory.metadata.isExpanded ? BsChevronDown : BsChevronUp

  const handleClick = () => {
    emit(
      directory.metadata.isExpanded ? "editor.collapse-directory" : "editor.expand-directory",
      directory,
    )
  }

  const handleContextMenu = (event: MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    showContextMenu({ x: event.pageX, y: event.pageY, target: directory })
  }

  return Either.fromNullable(directory).fold(Null, (directory) => (
    <ActionListItem
      style={{ paddingLeft }}
      text={directory.readableName}
      Icon={Icon}
      onClick={handleClick}
      isCurrent={false}
      onContextMenu={handleContextMenu}
    >
      <Chevron className="shrink-0 text-xs" />

      <DirectoryContent
        directory={directory}
        isExpanded={directory.metadata.isExpanded}
      />
    </ActionListItem>
  ))
}
