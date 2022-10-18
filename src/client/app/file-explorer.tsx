import React from "react"
import { useHotkeys } from "react-hotkeys-hook"

import { useAppDispatch, useAppSelector } from "@client/state"
import { useContextMenu } from "@client/context-menu"
import Either from "@core/utils/either"

import FileOrDirectory from "@client/app/components/file-explorer/file-or-directory"
import Null from "@client/null"
import { ExtensionContextMenuLocation } from "@core/constants"
import { OrdoCommand } from "@core/types"
import { showCreateDirectoryModal, showCreateFileModal } from "@client/create-modal/store"
import { OrdoDirectory } from "@core/app/types"

export default function FileExplorer() {
  const parent = useAppSelector((state) => state.app.personalDirectory)
  const commands = useAppSelector((state) => state.commandPalette.commands)

  const children: OrdoCommand<string>[] = [
    {
      title: "@app/create-file",
      icon: "BsFilePlus",
      action: (_, { target, dispatch }) => dispatch(showCreateFileModal(target as OrdoDirectory)),
      accelerator: "ctrl+n",
    },
    {
      title: "@app/create-directory",
      icon: "BsFolderPlus",
      action: (_, { target, dispatch }) =>
        dispatch(showCreateDirectoryModal(target as OrdoDirectory)),
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
    </div>
  ))
}
