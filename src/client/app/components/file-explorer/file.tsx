import type { OrdoFile } from "@core/app/types"

import React, { MouseEvent } from "react"

import { deleteFileOrDirectory, openFile } from "@client/app/store"
import { selectActivity } from "@client/activity-bar/store"
import { useAppDispatch, useAppSelector } from "@client/state"
import { useContextMenu } from "@client/context-menu"
import { IconName } from "@client/use-icon"
import { ORDO_FILE_EXTENSION } from "@core/app/constants"
import ActionListItem from "@client/common/action-list-item"
import { OrdoCommand } from "@core/types"
import { ExtensionContextMenuLocation } from "@core/constants"

type Props = {
  item: OrdoFile
}

export default function File({ item }: Props) {
  const dispatch = useAppDispatch()
  const commands = useAppSelector((state) => state.commandPalette.commands)

  const currentFile = useAppSelector((state) => state.app.currentFile)
  const icon: IconName = item.extension === ORDO_FILE_EXTENSION ? "BsFileEarmarkText" : "BsMarkdown"

  // TODO: Move RenameModal, CreateFileModal and CreateDirectoryModal management to store
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
        command.showInContextMenu === ExtensionContextMenuLocation.FILE ||
        command.showInContextMenu === ExtensionContextMenuLocation.FILE_OR_DIRECTORY ||
        command.showInContextMenu === ExtensionContextMenuLocation.FILE_OR_DIRECTORY_OR_ROOT
    ),
  ]

  // TODO: Move ContextMenu management to store
  const { showContextMenu, ContextMenu } = useContextMenu({ children })

  const paddingLeft = `${item.depth * 10}px`
  const isCurrent = item.path === currentFile?.path

  const handleClick = () => {
    dispatch(selectActivity("editor"))
    dispatch(openFile(item))
  }

  const handleContextMenu = (e: MouseEvent) => showContextMenu(e, item)

  return (
    <>
      <ActionListItem
        style={{ paddingLeft }}
        text={item.readableName}
        icon={icon}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        isCurrent={isCurrent}
      />

      <ContextMenu />
    </>
  )
}
