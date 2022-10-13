import React from "react"
import { useHotkeys } from "react-hotkeys-hook"

import { useAppSelector } from "@client/state"
import { useContextMenu } from "@client/context-menu"
import { useCreateFileModal, useCreateFolderModal } from "@client/app/hooks/use-create-modal"
import Either from "@core/utils/either"

import FileOrFolder from "@client/app/components/file-explorer/file-or-folder"
import Null from "@client/null"

export default function FileExplorer() {
  const root = useAppSelector((state) => state.app.personalDirectory)

  const { showCreateFileModal, CreateFileModal } = useCreateFileModal({ parent: root })
  const { showCreateFolderModal, CreateFolderModal } = useCreateFolderModal({ parent: root })

  // TODO: Register hotkeys from commands
  useHotkeys("ctrl+n", () => showCreateFileModal())
  useHotkeys("ctrl+shift+n", () => showCreateFolderModal())

  // TODO: Extract to CreateCommandExtension
  const { showContextMenu, ContextMenu } = useContextMenu({
    children: [
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
    ],
  })

  return Either.fromNullable(root)
    .chain((folder) => Either.fromNullable(folder.children))
    .fold(Null, (items) => (
      <div className="h-full" onContextMenu={(e) => showContextMenu(e, root!)}>
        {items.map((item) => (
          <FileOrFolder key={item.path} item={item} />
        ))}
        <ContextMenu />
        <CreateFileModal />
        <CreateFolderModal />
      </div>
    ))
}
