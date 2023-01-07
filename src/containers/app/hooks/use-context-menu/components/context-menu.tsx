import { useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import ContextMenuItem from "$containers/app/hooks/use-context-menu/components/context-menu-item"
import { hideContextMenu } from "$containers/app/hooks/use-context-menu/store"

import Null from "$core/components/null"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { Either } from "$core/utils/either"

export default function ContextMenu() {
  const commands = useAppSelector((state) => state.app.commands)
  const isShown = useAppSelector((state) => state.contextMenu.isShown)
  const structure = useAppSelector((state) => state.contextMenu.structure)
  const target = useAppSelector((state) => state.contextMenu.target)
  const x = useAppSelector((state) => state.contextMenu.x)
  const y = useAppSelector((state) => state.contextMenu.y)

  const dispatch = useAppDispatch()

  const [commandList, setCommandList] = useState(structure.children)

  useHotkeys("escape", (e) =>
    Either.of(e)
      .tap((e) => e.preventDefault())
      .tap((e) => e.stopPropagation())
      .tap(() => dispatch(hideContextMenu())),
  )

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

  return Either.fromBoolean(isShown)
    .chain(() => Either.fromNullable(structure))
    .fold(Null, () => (
      <div
        className="fixed top-0 left-0 right-0 bottom-0 cursor-default z-50"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()

          dispatch(hideContextMenu())
        }}
        onContextMenu={(event) => {
          event.preventDefault()
          event.stopPropagation()

          dispatch(hideContextMenu())
        }}
        role="none"
      >
        <div
          style={{ marginLeft: `${x}px`, marginTop: `${y}px` }}
          className="inline-block bg-neutral-50 dark:bg-neutral-600 w-autoo shadow-lg"
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
