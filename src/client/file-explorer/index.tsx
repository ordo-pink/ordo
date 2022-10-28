import type { OrdoCommand } from "@core/types"

import React from "react"
import { useTranslation } from "react-i18next"

import { showCreateDirectoryModal, showCreateFileModal } from "@client/create-modal/store"
import { useAppDispatch, useAppSelector } from "@client/common/hooks/state-hooks"
import { ExtensionContextMenuLocation } from "@core/constants"
import { useContextMenu } from "@client/context-menu"
import Either from "@client/common/utils/either"

import { useIcon } from "@client/common/hooks/use-icon"

import { OrdoButtonNeutral } from "@client/common/components/button"
import FileOrDirectory from "@client/file-explorer/components/file-or-directory"
import Null from "@client/common/components/null"

export default function FileExplorer() {
  const dispatch = useAppDispatch()

  const parent = useAppSelector((state) => state.app.personalDirectory)
  const commands = useAppSelector((state) => state.commandPalette.commands)

  const { t } = useTranslation()

  const children: OrdoCommand<string>[] = commands.filter(
    (command) =>
      command.showInContextMenu === ExtensionContextMenuLocation.ROOT ||
      command.showInContextMenu === ExtensionContextMenuLocation.DIRECTORY_OR_ROOT ||
      command.showInContextMenu === ExtensionContextMenuLocation.FILE_OR_DIRECTORY_OR_ROOT
  )

  const { showContextMenu, ContextMenu } = useContextMenu({ children })

  const CreateFileIcon = useIcon("BsFilePlus")
  const CreateDirectoryIcon = useIcon("BsFolderPlus")

  return Either.fromNullable(parent).fold(Null, (directory) => (
    <div
      className="h-full flex flex-col justify-between"
      onContextMenu={(e) => showContextMenu(e, directory)}
    >
      <div className="h-full grow overflow-y-scroll">
        {directory.children.map((item) => (
          <FileOrDirectory key={item.path} item={item} />
        ))}
        <ContextMenu />
      </div>

      <div className="flex items-center justify-between p-1 rounded-md text-sm">
        <OrdoButtonNeutral onClick={() => dispatch(showCreateFileModal(parent))}>
          <div className="flex items-center md:space-x-2">
            <CreateFileIcon />
          </div>
        </OrdoButtonNeutral>
        <OrdoButtonNeutral onClick={() => dispatch(showCreateDirectoryModal(parent))}>
          <div className="flex items-center md:space-x-2">
            <CreateDirectoryIcon />
          </div>
        </OrdoButtonNeutral>
      </div>
    </div>
  ))
}
