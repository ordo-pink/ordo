import { SystemDirectory } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
import { IOrdoDirectory } from "@ordo-pink/fs-entity"
import { ActionListItem, Null } from "@ordo-pink/react"
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
import { useAppDispatch } from "../../../../core/state/hooks/use-app-dispatch"
import { useExtensionSelector } from "../../../../core/state/hooks/use-extension-selector"
import { EditorActivityState } from "../../types"

type Props = {
  directory: IOrdoDirectory
}

export default function Directory({ directory }: Props) {
  const dispatch = useAppDispatch()

  const editorSelector = useExtensionSelector<EditorActivityState>()

  const currentFile = editorSelector((state) => state["ordo-activity-editor"]?.currentFile) ?? null

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
    if (!currentFile) return

    if (currentFile.path.startsWith(directory.path)) {
      setIsExpanded(true)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      persistedStore.get("expandedDirectories").then((expanded: any) => {
        if (!expanded || expanded.includes(directory.path)) return

        persistedStore
          .set("expandedDirectories", expanded.concat([directory.path]))
          .then(() => persistedStore.getState())
      })
    }
  }, [currentFile, directory, persistedStore])

  useEffect(() => {
    persistedStore
      .get("expandedDirectories")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((dirs: any) => setExpandedDirectories(dirs ?? []))
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          persistedStore.get("expandedDirectories").then((expanded: any) => {
            if (!expanded || expanded.includes(directory.path)) return

            persistedStore
              .set("expandedDirectories", expanded.concat([directory.path]))
              .then(() => persistedStore.getState())
          })
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          persistedStore.get("expandedDirectories").then((expanded: any) => {
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
