import type { OrdoFile, OrdoDirectory } from "@core/app/types"
import type { Nullable, OrdoCommand } from "@core/types"

import React, { MouseEvent } from "react"
import { useTranslation } from "react-i18next"
import { identity } from "ramda"

import { useIcon } from "@client/use-icon"
import { useAppDispatch, useAppSelector } from "@client/state"

import Accelerator from "@client/context-menu/components/accelerator"

type Props = {
  item: OrdoCommand<string>
  target: Nullable<OrdoFile | OrdoDirectory>
  hideContextMenu: (event: MouseEvent) => void
}

export default function MenuItem({ item, hideContextMenu, target }: Props) {
  const currentFile = useAppSelector((state) => state.app.currentFile)
  const state = useAppSelector(identity)
  const Icon = useIcon(item.icon)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const title = t(item.title)

  const onClick = (event: MouseEvent) => {
    hideContextMenu(event)

    if (item.action) {
      item.action(state, { dispatch, contextMenuTarget: target, currentFile })
    }
  }

  return (
    <div
      className="hover-passive px-4 py-1 text-sm flex items-center justify-between"
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        <Icon className="shrink-0" />
        <div title={title} className="truncate">
          {title}
        </div>
      </div>
      <Accelerator accelerator={item.accelerator} />
    </div>
  )
}
