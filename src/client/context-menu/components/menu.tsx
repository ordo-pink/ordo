import type { Menu } from "@client/context-menu/types"
import type { OrdoFile, OrdoDirectory } from "@core/app/types"
import type { Nullable, OrdoCommand } from "@core/types"

import React, { MouseEvent } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import Either from "@client/common/utils/either"

import MenuItem from "@client/context-menu/components/menu-item"
import Null from "@client/common/components/null"

type Props = {
  structure: Menu
  isShown: boolean
  target: Nullable<OrdoFile | OrdoDirectory>
  hideContextMenu: (event: MouseEvent) => void
  x: number
  y: number
}

export default function Menu({ structure, isShown, hideContextMenu, target, x, y }: Props) {
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
          <MenuItem
            item={child as OrdoCommand<string>}
            key={index}
            hideContextMenu={hideContextMenu}
            target={target}
          />
        ))}
      </div>
    </div>
  ))
}
