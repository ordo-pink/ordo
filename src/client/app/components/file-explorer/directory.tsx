import type { OrdoFolder } from "@core/app/types"

import React, { useState } from "react"

import { useCreateFileModal, useCreateFolderModal } from "@client/app/hooks/use-create-modal"
import { useRenameModal } from "@client/app/hooks/use-rename-modal"
import { useContextMenu } from "@client/context-menu"
import { useAppDispatch } from "@client/state"
import { useIcon } from "@client/use-icon"
import { deleteFileOrFolder } from "@client/app/store"
import { SEPARATOR } from "@client/context-menu/constants"
import { FolderContextMenu } from "@client/app/context-menu"

import FileOrFolder from "@client/app/components/file-explorer/file-or-folder"

type Props = {
  item: OrdoFolder
}

export default function Directory({ item }: Props) {
  const dispatch = useAppDispatch()

  const hasChildren = item.children.length > 0

  const ChevronDown = useIcon("BsChevronDown")
  const ChevronRight = useIcon("BsChevronRight")
  const OpenFolder = useIcon(hasChildren ? "AiFillFolderOpen" : "AiOutlineFolderOpen")
  const ClosedFolder = useIcon(hasChildren ? "AiFillFolder" : "AiOutlineFolder")

  const [isExpanded, setIsExpanded] = useState(false)

  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight
  const FolderIcon = isExpanded ? OpenFolder : ClosedFolder

  // This increases padding. The deeper the folder, the righter it goes
  const paddingLeft = `${(item.depth + 5) * 2}px`

  const handleChevronClick = () => setIsExpanded((value) => !value)

  const { showRenameModal, RenameModal } = useRenameModal(item)
  const { showCreateFileModal, CreateFileModal } = useCreateFileModal({ parent: item })
  const { showCreateFolderModal, CreateFolderModal } = useCreateFolderModal({ parent: item })

  // TODO: Move CreateModal and RenameModal handling to store
  const { showContextMenu, ContextMenu } = useContextMenu({
    children: [
      {
        title: "@app/rename",
        icon: "BsPencilSquare",
        action: () => showRenameModal(),
      },
      {
        title: "@app/create-file",
        icon: "BsFilePlus",
        action: () => showCreateFileModal(),
        accelerator: "ctrl+n",
      },
      {
        title: "@app/create-folder",
        icon: "BsFolderPlus",
        action: () => showCreateFolderModal(),
        accelerator: "ctrl+shift+n",
      },
      {
        title: "@app/delete",
        icon: "BsTrash",
        action: () => {
          dispatch(deleteFileOrFolder(item.path))
        },
      },
    ].concat(FolderContextMenu as any[]) as any[],
  })

  return (
    <div onContextMenu={(e) => showContextMenu(e, item)}>
      <div
        className="flex items-center space-x-2 py-1 px-2 cursor-pointer rounded-md hover-passive"
        onClick={handleChevronClick}
        onContextMenu={(e) => showContextMenu(e, item)}
      >
        <ChevronIcon className="shrink-0" />
        <FolderIcon className="shrink-0" />
        <div className="truncate text-sm">{item.readableName}</div>
      </div>
      <div style={{ paddingLeft }}>
        {isExpanded && (
          <div>
            {item.children.map((item) => (
              <FileOrFolder key={item.path} item={item} />
            ))}
          </div>
        )}
      </div>
      <ContextMenu />
      <RenameModal />
      <CreateFileModal />
      <CreateFolderModal />
    </div>
  )
}
