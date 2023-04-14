import { IOrdoDirectory, IconSize } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import {
  ActionListItem,
  DirectoryIcon,
  Null,
  useCommands,
  useContextMenu,
  useWindowSize,
} from "@ordo-pink/react-utils"
import { MouseEvent } from "react"
import { BsChevronDown, BsChevronUp } from "react-icons/bs"
import DirectoryContent from "./directory-content"

type Props = {
  directory: IOrdoDirectory<{ isExpanded: boolean; color: string }>
}

export default function Directory({ directory }: Props) {
  const { emit } = useCommands()
  const [width] = useWindowSize()

  const isNarrow = width < 768

  const { showContextMenu } = useContextMenu()

  const depth = directory.path.slice(1, -1).split("/").filter(Boolean).length

  const paddingLeft = `${depth * 10}px`

  const Chevron = directory.metadata.isExpanded ? BsChevronDown : BsChevronUp

  const handleClick = (event: MouseEvent) => {
    if (isNarrow) event.stopPropagation()

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
      Icon={() => (
        <DirectoryIcon
          directory={directory}
          size={IconSize.EXTRA_SMALL}
          showExpansion
        />
      )}
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
