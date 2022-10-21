import type { OrdoDirectory } from "@core/app/types"

import React, { MouseEvent, useState } from "react"

import { useAppDispatch, useAppSelector } from "@client/state"
import { useContextMenu } from "@client/context-menu"
import { useIcon } from "@client/use-icon"
import { deleteFileOrDirectory } from "@client/app/store"

import FileOrDirectory from "@client/file-explorer/components/file-or-directory"
import ActionListItem from "@client/common/action-list-item"
import { OrdoCommand } from "@core/types"
import { ExtensionContextMenuLocation } from "@core/constants"

type Props = {
  item: OrdoDirectory
}

export default function Directory({ item }: Props) {
  const dispatch = useAppDispatch()

  const commands = useAppSelector((state) => state.commandPalette.commands)

  const hasChildren = item.children.length > 0

  const ChevronDown = useIcon("HiOutlineChevronDown")
  const ChevronUp = useIcon("HiOutlineChevronUp")
  const openIcon = hasChildren ? "AiFillFolderOpen" : "AiOutlineFolderOpen"
  const closedIcon = hasChildren ? "AiFillFolder" : "AiOutlineFolder"

  const [isExpanded, setIsExpanded] = useState(false)

  const ChevronIcon = isExpanded ? ChevronDown : ChevronUp
  const icon = isExpanded ? openIcon : closedIcon

  // This increases padding. The deeper the directory, the righter it goes
  const paddingLeft = `${item.depth * 10}px`

  const handleClick = () => setIsExpanded((value) => !value)

  const children: OrdoCommand<string>[] = [
    {
      title: "@app/delete",
      icon: "BsTrash",
      action: () => {
        dispatch(deleteFileOrDirectory(item.path))
      },
    },
    ...commands.filter(
      (command) =>
        command.showInContextMenu === ExtensionContextMenuLocation.DIRECTORY ||
        command.showInContextMenu === ExtensionContextMenuLocation.FILE_OR_DIRECTORY ||
        command.showInContextMenu === ExtensionContextMenuLocation.DIRECTORY_OR_ROOT
    ),
  ]

  // TODO: Move CreateModal and RenameModal handling to store
  const { showContextMenu, ContextMenu } = useContextMenu({ children })

  const handleContextMenu = (event: MouseEvent) => showContextMenu(event, item)

  return (
    <>
      <ActionListItem
        style={{ paddingLeft }}
        text={item.readableName}
        icon={icon}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        isCurrent={false}
      >
        <ChevronIcon className="shrink-0" />
        {isExpanded && (
          <div>
            {item.children.map((item) => (
              <FileOrDirectory key={item.path} item={item} />
            ))}
          </div>
        )}
      </ActionListItem>

      <ContextMenu />
    </>
  )
}
