import React from "react"

import { useAppSelector } from "@client/state"
import Either from "@core/utils/either"
import Null from "@client/null"
import FileOrFolder from "./components/file-explorer/file-or-folder"
import { useContextMenu } from "@client/context-menu"
import { useCreateFileModal, useCreateFolderModal } from "./hooks/use-create-modal"
import { useHotkeys } from "react-hotkeys-hook"

export default function FileExplorer() {
  const root = useAppSelector((state) => state.app.personalDirectory)

  const { showCreateFileModal, CreateFileModal } = useCreateFileModal({ parent: root })
  const { showCreateFolderModal, CreateFolderModal } = useCreateFolderModal({ parent: root })

  useHotkeys("ctrl+n", () => showCreateFileModal())
  useHotkeys("ctrl+shift+n", () => showCreateFolderModal())

  const { showContextMenu, ContextMenu } = useContextMenu({
    children: [
      {
        title: "app.folder.create-file",
        icon: "BsFilePlus",
        action: showCreateFileModal,
        accelerator: "CommandOrControl+N",
      },
      {
        title: "app.folder.create-folder",
        icon: "BsFolderPlus",
        action: showCreateFolderModal,
        accelerator: "CommandOrControl+Shift+N",
      },
      { title: "separator" },
      {
        title: "app.file.copy-path",
        icon: "BsSignpost2",
        action: () => console.log("TODO"),
        accelerator: "CommandOrControl+Alt+C",
      },
      {
        title: "app.file.copy-relative-path",
        icon: "BsSignpost",
        action: () => console.log("TODO"),
        accelerator: "CommandOrControl+Shift+Alt+C",
      },
      {
        title: "app.file.reveal-in-files",
        icon: "BsFolderCheck",
        action: () => console.log("TODO"),
      },
    ],
  })

  return Either.fromNullable(root)
    .chain((folder) => Either.fromNullable(folder.children))
    .fold(Null, (items) => (
      <div className="h-full" onContextMenu={showContextMenu}>
        {items.map((item) => (
          <FileOrFolder key={item.path} item={item} />
        ))}
        <ContextMenu />
        <CreateFileModal />
        <CreateFolderModal />
      </div>
    ))
}
