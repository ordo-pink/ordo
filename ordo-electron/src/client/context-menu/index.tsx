import type { Menu as TMenu } from "@client/context-menu/types"
import type { OrdoFile, OrdoDirectory } from "@core/app/types"
import type { Nullable } from "@core/types"

import React, { useState, useCallback, MouseEvent } from "react"

import Menu from "@client/context-menu/components/menu"

export const useContextMenu = (structure: TMenu) => {
  const [isShown, setIsShown] = useState(false)
  const [target, setTarget] = useState<Nullable<OrdoFile | OrdoDirectory>>(null)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const showContextMenu = (event: MouseEvent, target: OrdoFile | OrdoDirectory) => {
    event.preventDefault()
    event.stopPropagation()

    setX(event.pageX)
    setY(event.pageY)
    setIsShown(true)
    setTarget(target)
  }

  const hideContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    setX(0)
    setY(0)
    setIsShown(false)
    setTarget(null)
  }

  const Component = useCallback(
    () => (
      <Menu
        isShown={isShown}
        structure={structure}
        x={x}
        y={y}
        hideContextMenu={hideContextMenu}
        target={target}
      />
    ),
    [x, y, isShown, structure]
  )

  return {
    showContextMenu,
    hideContextMenu,
    ContextMenu: Component,
  }
}
