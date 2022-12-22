import { Nullable, OrdoDirectory, OrdoFile } from "$core/types"
import { ContextMenuTemplate as ContextMenuType, ContextMenuTarget } from "../types"
import { useHotkeys } from "react-hotkeys-hook"
import { Either } from "$core/utils/either"
import Null from "$core/components/null"
import ContextMenuItem from "./context-menu-item"
import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch.hook"
import { hideContextMenu } from "../store"

export default function ContextMenu() {
  const isShown = useAppSelector((state) => state.contextMenu.isShown)
  const structure = useAppSelector((state) => state.contextMenu.structure)
  const target = useAppSelector((state) => state.contextMenu.target)
  const x = useAppSelector((state) => state.contextMenu.x)
  const y = useAppSelector((state) => state.contextMenu.y)

  const dispatch = useAppDispatch()

  useHotkeys("escape", (e) =>
    Either.of(e)
      .tap((e) => e.preventDefault())
      .tap((e) => e.stopPropagation())
      .tap(() => dispatch(hideContextMenu())),
  )

  return Either.fromBoolean(isShown)
    .chain(() => Either.fromNullable(structure))
    .fold(Null, (template) => (
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
          {template.children.map((child) => (
            <ContextMenuItem
              key={child.title}
              item={child}
            />
          ))}
        </div>
      </div>
    ))
}
