import { useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import ContextMenuItem from "$containers/app/hooks/use-context-menu/components/context-menu-item"
import { hideContextMenu } from "$containers/app/hooks/use-context-menu/store"

import Null from "$core/components/null"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { ThunkFn } from "$core/types"
import { Either } from "$core/utils/either"
import { preventDefault, stopPropagation } from "$core/utils/event"
import { lazyBox } from "$core/utils/lazy-box"

import "$containers/app/hooks/use-context-menu/index.css"

export default function ContextMenu() {
  const dispatch = useAppDispatch()

  const commands = useAppSelector((state) => state.app.commands)
  const isShown = useAppSelector((state) => state.contextMenu.isShown)
  const structure = useAppSelector((state) => state.contextMenu.structure)
  const target = useAppSelector((state) => state.contextMenu.target)
  const x = useAppSelector((state) => state.contextMenu.x)
  const y = useAppSelector((state) => state.contextMenu.y)

  const [commandList, setCommandList] = useState(structure.children)

  useEffect(() => {
    commands.forEach((command) => {
      if (typeof command.showInContextMenu === "boolean" && command.showInContextMenu) {
        setCommandList((commands) => commands.concat([command]))
      } else if (
        typeof command.showInContextMenu === "function" &&
        target &&
        command.showInContextMenu(target)
      ) {
        setCommandList((commands) => commands.concat([command]))
      }
    })

    return () => {
      setCommandList([])
    }
  }, [commands, target])

  const hide = lazyBox<{ preventDefault: ThunkFn<void>; stopPropagation: ThunkFn<void> }>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .fold(() => dispatch(hideContextMenu())),
  )

  useHotkeys("escape", hide)

  return Either.fromBoolean(isShown).fold(Null, () => (
    <div
      className="context-menu"
      onClick={hide}
      onContextMenu={hide}
      role="none"
    >
      <div
        style={{ marginLeft: `${x}px`, marginTop: `${y}px` }}
        className="context-menu_items"
      >
        {commandList.map((child) => (
          <ContextMenuItem
            key={child.title}
            item={child}
          />
        ))}
      </div>
    </div>
  ))
}
