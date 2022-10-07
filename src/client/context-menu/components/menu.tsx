import type { TMenu } from "@client/context-menu/types"

import React, { MouseEvent } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import Either from "@core/utils/either"

import Null from "@client/null"
import MenuItem from "@client/context-menu/components/menu-item"

type TProps = {
  structure: TMenu
  isShown: boolean
  hideContextMenu: (event: MouseEvent) => void
  x: number
  y: number
}

export default function Menu({ structure, isShown, hideContextMenu, x, y }: TProps) {
  useHotkeys("escape", (event) => hideContextMenu(event as unknown as MouseEvent))

  return Either.fromBoolean(isShown).fold(Null, () => (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 cursor-default z-50"
      onClick={hideContextMenu}
      onContextMenu={hideContextMenu}
    >
      <div
        style={{ marginLeft: `${x}px`, marginTop: `${y}px` }}
        className="inline-block bg-neutral-50 dark:bg-neutral-600 w-auto shadow-lg"
      >
        {structure.children.map((child, index) => (
          <MenuItem item={child} key={index} hideContextMenu={hideContextMenu} />
        ))}
      </div>
    </div>
  ))
}
