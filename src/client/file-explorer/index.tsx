import type { OrdoCommand } from "@core/types"

import React from "react"

import { useAppSelector } from "@client/common/hooks/state-hooks"
import { ExtensionContextMenuLocation } from "@core/constants"
import { useContextMenu } from "@client/context-menu"
import Either from "@client/common/utils/either"

import FileOrDirectory from "@client/file-explorer/components/file-or-directory"
import Null from "@client/common/null"

export default function FileExplorer() {
  const parent = useAppSelector((state) => state.app.personalDirectory)
  const commands = useAppSelector((state) => state.commandPalette.commands)

  const children: OrdoCommand<string>[] = commands.filter(
    (command) =>
      command.showInContextMenu === ExtensionContextMenuLocation.ROOT ||
      command.showInContextMenu === ExtensionContextMenuLocation.DIRECTORY_OR_ROOT ||
      command.showInContextMenu === ExtensionContextMenuLocation.FILE_OR_DIRECTORY_OR_ROOT
  )

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
