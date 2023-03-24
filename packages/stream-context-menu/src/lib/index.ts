import { RegisterContextMenuItemFn, UnregisterContextMenuItemFn } from "@ordo-pink/common-types"
import { Nullable } from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { IconType } from "react-icons"
import { combineLatestWith, map, merge, scan, shareReplay, Subject } from "rxjs"
import { BehaviorSubject } from "rxjs"

export type ShowContextMenuParams = {
  x: number
  y: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any
}

export const contextMenuToggle$ = new BehaviorSubject<Nullable<ShowContextMenuParams>>(null)

export type ContextMenuItem = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shouldShow: (target: any) => boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payloadCreator: (target: any) => any
  extensionName: string
  commandName: string
  name: string
  Icon: IconType
  accelerator?: string
}

const addContextMenuItem$ = new Subject<ContextMenuItem>()
const removeContextMenuItem$ = new Subject<string>()
const clearContextMenuItems$ = new Subject<null>()

const add = (newContextMenuItem: ContextMenuItem) => (state: ContextMenuItem[]) => {
  const exists = state.some((item) => item.name === newContextMenuItem.name)

  return exists ? state : [...state, newContextMenuItem]
}

const remove = (ContextMenuItem: string) => (state: ContextMenuItem[]) =>
  state.filter((a) => a.name !== ContextMenuItem)

const clear = () => () => [] as ContextMenuItem[]

export const contextMenuItems$ = merge(
  addContextMenuItem$.pipe(map(add)),
  removeContextMenuItem$.pipe(map(remove)),
  clearContextMenuItems$.pipe(map(clear)),
).pipe(
  scan((acc, f) => f(acc), [] as ContextMenuItem[]),
  shareReplay(1),
)

contextMenuItems$.subscribe()

const contextMenu$ = contextMenuToggle$.pipe(
  combineLatestWith(contextMenuItems$),
  map(([toggle, items]) => {
    if (!toggle) return null

    const structure = items.filter((item) => item.shouldShow(toggle.target))

    return {
      ...toggle,
      structure,
    }
  }),
)

export const _initContextMenu = callOnce(() => {
  contextMenu$.subscribe()

  return contextMenu$
})

export const registerContextMenuItem: RegisterContextMenuItemFn =
  (extensionName) => (command, item) => {
    addContextMenuItem$.next({
      ...item,
      extensionName,
      commandName: command[0].replace(`${extensionName}.`, ""),
      name: command[0],
    })
  }

export const unregisterContextMenuItem: UnregisterContextMenuItemFn =
  (extensionName) => (commandName) => {
    removeContextMenuItem$.next(`${extensionName}.${commandName}`)
  }

export const clearContextMenuItems = () => {
  clearContextMenuItems$.next(null)
}

export const showContextMenu = ({ x, y, target }: ShowContextMenuParams) => {
  contextMenuToggle$.next({ x, y, target })
}

export const hideContextMenu = () => {
  contextMenuToggle$.next(null)
}
