import { ThunkFn } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { lazyBox, preventDefault, stopPropagation } from "@ordo-pink/fns"
import { Null } from "@ordo-pink/react-utils"
import { useEffect, useState, useRef, useLayoutEffect } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import ContextMenuItem from "../../../../../containers/app/hooks/use-context-menu/components/context-menu-item"
import { hideContextMenu } from "../../../../../containers/app/hooks/use-context-menu/store"
import { useAppDispatch } from "../../../../../core/state/hooks/use-app-dispatch"
import { useAppSelector } from "../../../../../core/state/hooks/use-app-selector"

export default function ContextMenu() {
  const dispatch = useAppDispatch()

  const commands = useAppSelector((state) => state.app.commands)
  const isShown = useAppSelector((state) => state.contextMenu.isShown)
  const structure = useAppSelector((state) => state.contextMenu.structure)
  const target = useAppSelector((state) => state.contextMenu.target)
  const mouseX = useAppSelector((state) => state.contextMenu.x)
  const mouseY = useAppSelector((state) => state.contextMenu.y)

  const contextMenuContainer = useRef<HTMLDivElement>(null)

  const [commandList, setCommandList] = useState(structure.children)
  const [containerSize, setContainerSize] = useState<{ width: number; height: number } | undefined>(
    undefined,
  )

  const x =
    containerSize && window.innerWidth - (mouseX + containerSize.width) < 0
      ? mouseX - containerSize.width
      : mouseX
  const y =
    containerSize && window.innerHeight - (mouseY + containerSize.height) < 0
      ? mouseY - containerSize.height
      : mouseY

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

  useLayoutEffect(() => {
    if (contextMenuContainer.current) {
      setContainerSize(contextMenuContainer?.current?.getBoundingClientRect())
    }
    // don't trust eslint. it works because this component renders 2 times due to useEffect on 50th line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextMenuContainer.current])

  const hide = lazyBox<{ preventDefault: ThunkFn<void>; stopPropagation: ThunkFn<void> }>((box) =>
    box
      .tap(preventDefault)
      .tap(stopPropagation)
      .fold(() => dispatch(hideContextMenu())),
  )

  useHotkeys("escape", hide)

  return Either.fromBoolean(isShown).fold(Null, () => (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 cursor-default z-50"
      onClick={hide}
      onContextMenu={hide}
      role="none"
    >
      <div
        style={{ marginLeft: `${x}px`, marginTop: `${y}px` }}
        className="inline-block bg-white dark:bg-neutral-600 shadow-lg"
        ref={contextMenuContainer}
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
