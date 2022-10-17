import React from "react"
import { useHotkeys } from "react-hotkeys-hook"

import { useAppSelector } from "@client/state"
import { useContextMenu } from "@client/context-menu"
import { useCreateFileModal, useCreateDirectoryModal } from "@client/app/hooks/use-create-modal"
import Either from "@core/utils/either"

import FileOrDirectory from "@client/app/components/file-explorer/file-or-directory"
import Null from "@client/null"
import { ExtensionContextMenuLocation } from "@core/constants"
import { OrdoCommand } from "@core/types"

export default function FileExplorer() {
  const parent = useAppSelector((state) => state.app.personalDirectory)
  const commands = useAppSelector((state) => state.commandPalette.commands)

  const { showCreateFileModal, CreateFileModal } = useCreateFileModal({ parent })
  const { showCreateDirectoryModal, CreateDirectoryModal } = useCreateDirectoryModal({
    parent,
  })

  // TODO: Register hotkeys from commands
  useHotkeys("ctrl+n", () => showCreateFileModal())
  useHotkeys("ctrl+shift+n", () => showCreateDirectoryModal())

  const children: OrdoCommand<string>[] = [
    {
      title: "@app/create-file",
      icon: "BsFilePlus",
      action: () => showCreateFileModal(),
      accelerator: "ctrl+n",
    },
    {
      title: "@app/create-directory",
      icon: "BsFolderPlus",
      action: () => showCreateDirectoryModal(),
      accelerator: "ctrl+shift+n",
    },
    ...commands.filter(
      (command) =>
        command.showInContextMenu === ExtensionContextMenuLocation.DIRECTORY ||
        command.showInContextMenu === ExtensionContextMenuLocation.FILE_OR_DIRECTORY
    ),
  ]

  // TODO: Extract to CreateCommandExtension
  const { showContextMenu, ContextMenu } = useContextMenu({ children })

  return Either.fromNullable(parent).fold(Null, (directory) => (
    <div className="h-full" onContextMenu={(e) => showContextMenu(e, directory)}>
      {directory.children.map((item) => (
        <FileOrDirectory key={item.path} item={item} />
      ))}
      <ContextMenu />
      <CreateFileModal />
      <CreateDirectoryModal />
    </div>
  ))
}
