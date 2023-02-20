import { SystemDirectory } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { IOrdoDirectory } from "@ordo-pink/fs-entity"
import { Null } from "@ordo-pink/react-components"
import { MouseEvent, useContext, useEffect, useState } from "react"
import {
  AiFillFolder,
  AiFillFolderOpen,
  AiOutlineFolder,
  AiOutlineFolderOpen,
} from "react-icons/ai"
import { BsChevronDown, BsChevronUp } from "react-icons/bs"
import DirectoryContent from "./directory-content"
import { EditorContext } from ".."
import { useContextMenu } from "../../../../containers/app/hooks/use-context-menu"
import ActionListItem from "../../../../core/components/action-list/item"
import { useAppDispatch } from "../../../../core/state/hooks/use-app-dispatch"
import { preventDefault, stopPropagation } from "../../../../core/utils/event"
import { lazyBox } from "../../../../core/utils/lazy-box"

type Props = {
  directory: IOrdoDirectory
}

export default function Directory({ directory }: Props) {
  const dispatch = useAppDispatch()

  const [expandedDirectories, setExpandedDirectories] = useState<string[]>([])

  const [isExpanded, setIsExpanded] = useState(false)

  const { persistedStore } = useContext(EditorContext)

  const { showContextMenu } = useContextMenu()

  const depth = directory.path.slice(1, -1).split("/").filter(Boolean).length

  const paddingLeft = `${depth * 10}px`
  const hasChildren = directory && directory.children && directory.children.length > 0

  const OpenIcon = hasChildren ? AiFillFolderOpen : AiOutlineFolderOpen
  const ClosedIcon = hasChildren ? AiFillFolder : AiOutlineFolder
  const Icon = isExpanded ? OpenIcon : ClosedIcon

  const Chevron = isExpanded ? BsChevronDown : BsChevronUp

  useEffect(() => {
    persistedStore.get("expandedDirectories").then((dirs) => setExpandedDirectories(dirs ?? []))
  }, [persistedStore])

  useEffect(() => {
    setIsExpanded(expandedDirectories.includes(directory.path))
  }, [expandedDirectories, directory])

  const handleClick = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .fold(() => {
        setIsExpanded((value) => !value)

        if (!isExpanded) {
          persistedStore.get("expandedDirectories").then((expanded) => {
            if (!expanded || expanded.includes(directory.path)) return

            persistedStore
              .set("expandedDirectories", expanded.concat([directory.path]))
              .then(() => persistedStore.getState())
          })
        } else {
          persistedStore.get("expandedDirectories").then((expanded) => {
            if (!expanded || !expanded.includes(directory.path)) return

            const expandedCopy = [...expanded]

            expandedCopy.splice(expanded.indexOf(directory.path), 1)

            persistedStore
              .set("expandedDirectories", expandedCopy)
              .then(() => persistedStore.getState())
          })
        }
      }),
  )

  const handleContextMenu = lazyBox<MouseEvent>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .map(({ pageX, pageY }) => ({ x: pageX, y: pageY }))
      .fold(({ x, y }) => dispatch(showContextMenu({ target: directory, x, y }))),
  )

  return Either.fromNullable(directory)
    .chain(() =>
      Either.fromBoolean(directory.path !== SystemDirectory.INTERNAL).map(() => directory),
    )
    .fold(Null, (directory) => (
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
