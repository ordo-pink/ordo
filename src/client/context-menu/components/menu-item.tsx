import type { TMenuItem } from "@client/context-menu/types"

import React, { MouseEvent } from "react"
import { useTranslation } from "react-i18next"

import { useIcon } from "@client/use-icon"

import Accelerator from "@client/context-menu/components/accelerator"

type TProps = {
  item: TMenuItem
  hideContextMenu: (event: MouseEvent) => void
}

export default function MenuItem({ item, hideContextMenu }: TProps) {
  const Icon = useIcon(item.icon)
  const { t } = useTranslation()

  const title = t(item.title)

  const onClick = (event: MouseEvent) => {
    hideContextMenu(event)

    if (item.action) item.action()
  }

  return item.title === "separator" ? (
    <hr className="border-t border-neutral-300 dark:border-neutral-500" />
  ) : (
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
