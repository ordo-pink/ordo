import { CommandPaletteItem, Nullable, RegisterCommandPaletteItemFn } from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { BehaviorSubject } from "rxjs"
import { map, merge, scan, shareReplay, Subject } from "rxjs"

const addContextMenuItem$ = new Subject<CommandPaletteItem>()
const removeContextMenuItem$ = new Subject<string>()
const commandPalette$ = new BehaviorSubject<Nullable<CommandPaletteItem[]>>(null)

const add = (newContextMenuItem: CommandPaletteItem) => (state: CommandPaletteItem[]) => {
  const exists = state.some((item) => item.name === newContextMenuItem.name)

  return exists ? state : [...state, newContextMenuItem]
}

const remove = (id: string) => (state: CommandPaletteItem[]) => state.filter((a) => a.id !== id)

export const commandPaletteItems$ = merge(
  addContextMenuItem$.pipe(map(add)),
  removeContextMenuItem$.pipe(map(remove)),
).pipe(
  scan((acc, f) => f(acc), [] as CommandPaletteItem[]),
  shareReplay(1),
)

commandPaletteItems$.subscribe()

export const registerCommandPaletteItem: RegisterCommandPaletteItemFn = (
  item: CommandPaletteItem,
) => {
  addContextMenuItem$.next(item)
}

export const unregisterCommandPaletteItem = (id: string) => {
  removeContextMenuItem$.next(id)
}

export const showCommandPalette = (items: CommandPaletteItem[]) => {
  commandPalette$.next(items)
}

export const hideCommandPalette = () => {
  commandPalette$.next(null)
}

export const _initCommandPalette = callOnce(() => {
  commandPalette$.subscribe()

  return commandPalette$
})
