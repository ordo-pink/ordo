import type { OrdoFile } from "@core/app/types"

import React from "react"

import { deleteFileOrFolder, openFile } from "@client/app/store"
import { selectActivity } from "@client/activity-bar/store"
import { useRenameModal } from "@client/app/hooks/use-rename-modal"
import { useAppDispatch, useAppSelector } from "@client/state"
import { useContextMenu } from "@client/context-menu"
import { useIcon } from "@client/use-icon"
import { SEPARATOR } from "@client/context-menu/constants"
import { ORDO_FILE_EXTENSION } from "@core/app/constants"
import { FileContextMenu } from "@client/app/context-menu"
import { concat } from "lodash"

type Props = {
  item: OrdoFile
}

export default function File({ item }: Props) {
  const dispatch = useAppDispatch()

  const currentFile = useAppSelector((state) => state.app.currentFile)
  const { showRenameModal, RenameModal } = useRenameModal(item)
  const Icon = useIcon(item.extension === ORDO_FILE_EXTENSION ? "BsFileEarmarkText" : "BsMarkdown")

  // TODO: Move ContextMenu management to store
  const { showContextMenu, ContextMenu } = useContextMenu({
    children: [
      {
        title: "@app/rename",
        icon: "BsPencilSquare",
        accelerator: "f2",
        action: () => showRenameModal(),
      },
      {
        title: "@app/delete",
        icon: "BsTrash",
        action: () => {
          dispatch(deleteFileOrFolder(item.path))
        },
      },
    ].concat(FileContextMenu as any[]) as any[],
  })

  const paddingLeft = `${(item.depth + 5) * 2}px`

  const handleClick = () => {
    dispatch(selectActivity("editor"))
    dispatch(openFile(item))
  }

  return (
    <>
      <div
        style={{ paddingLeft }}
        className={`flex items-center space-x-2 truncate py-0.5 cursor-pointer hover-passive rounded-md ${
          item.path === currentFile?.path &&
          "hover:bg-gradient-to-r hover:from-rose-300 hover:dark:from-violet-700 hover:to-purple-300 hover:dark:to-purple-700 bg-gradient-to-r from-rose-300 dark:from-violet-700 to-purple-300 dark:to-purple-700"
        }`}
        onClick={handleClick}
        onContextMenu={(e) => showContextMenu(e, item)}
      >
        <Icon className="shrink-0" />
        <div className="truncate text-sm">{item.readableName}</div>

        <ContextMenu />
      </div>

      <RenameModal />
    </>
  )
}
