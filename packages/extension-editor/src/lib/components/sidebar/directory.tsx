import { IOrdoDirectory } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
// import { lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
// import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { ActionListItem, Null, useCommands } from "@ordo-pink/react-utils"
// import { MouseEvent } from "react"
import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineFolder,
  AiOutlineFolderOpen,
} from "react-icons/ai"
import { BsChevronDown, BsChevronUp } from "react-icons/bs"
import DirectoryContent from "./directory-content"
import { iconColors } from "../../colors"
// import { useContextMenu } from "../../../../containers/app/hooks/use-context-menu"
// import { updateDirectoryMetadata } from "../../../../containers/app/store"
// import { useAppDispatch } from "../../../../core/state/hooks/use-app-dispatch"

type Props = {
  directory: IOrdoDirectory<{ isExpanded: boolean; color: string }>
}

export default function Directory({ directory }: Props) {
  // const dispatch = useAppDispatch()

  // const { showContextMenu } = useContextMenu()
  const { emit: execute } = useCommands()

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
    execute(
      "fs.update-directory",
      OrdoDirectory.from({
        ...directory,
        metadata: { ...directory.metadata, isExpanded: !directory.metadata.isExpanded },
      }),
    )
  }

  // const handleContextMenu = lazyBox<MouseEvent>((box) =>
  //   box
  //     .tap(preventDefault)
  //     .tap(stopPropagation)
  //     .map(({ pageX, pageY }) => ({ x: pageX, y: pageY }))
  //     .fold(({ x, y }) => dispatch(showContextMenu({ target: directory, x, y }))),
  // )

  return Either.fromNullable(directory).fold(Null, (directory) => (
    <ActionListItem
      style={{ paddingLeft }}
      text={directory.readableName}
      Icon={Icon}
      onClick={handleClick}
      isCurrent={false}
      // onContextMenu={handleContextMenu}
    >
      <Chevron className="shrink-0 text-xs" />

      <DirectoryContent
        directory={directory}
        isExpanded={directory.metadata.isExpanded}
      />
    </ActionListItem>
  ))
}
