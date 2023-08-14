import { BehaviorSubject, map, merge, scan, shareReplay, Subject } from "rxjs"
import { ComponentType, useEffect } from "react"
import { IconType } from "react-icons"
import { Thunk, Unary, callOnce } from "#lib/tau/mod"
import { useSubscription } from "$hooks/use-subscription"
import { useCommands } from "$hooks/use-commands"
import { useModal } from "$hooks/use-modal"
import { hideModal } from "$streams/modal"
import CommandPaletteModal from "$components/command-palette"

export type UnregisterCommandPaletteItemFn = Unary<string, void>
export type RegisterCommandPaletteItemFn = Unary<CommandPaletteItem, void>

export type CommandPaletteItem = {
	id: string
	name: string
	Icon?: IconType
	Comment?: ComponentType
	Footer?: ComponentType
	onSelect: Thunk<void>
	accelerator?: string
}

const addContextMenuItem$ = new Subject<CommandPaletteItem>()
const removeContextMenuItem$ = new Subject<string>()
const commandPalette$ = new BehaviorSubject<CommandPaletteItem[]>([])

const add = (newContextMenuItem: CommandPaletteItem) => (state: CommandPaletteItem[]) => {
	const exists = state.some(item => item.name === newContextMenuItem.name)

	return exists ? state : [...state, newContextMenuItem]
}

const remove = (id: string) => (state: CommandPaletteItem[]) => state.filter(a => a.id !== id)

export const commandPaletteItems$ = merge(
	addContextMenuItem$.pipe(map(add)),
	removeContextMenuItem$.pipe(map(remove))
).pipe(
	scan((acc, f) => f(acc), [] as CommandPaletteItem[]),
	shareReplay(1)
)

export const registerCommandPaletteItem: RegisterCommandPaletteItemFn = (
	item: CommandPaletteItem
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
	commandPalette$.next([])
	hideModal()
}

export const initCommandPalette = callOnce(() => {
	const commands = useCommands()

	commandPaletteItems$.subscribe()
	commandPalette$.subscribe()

	commands.on("command-palette.show", ({ payload }) => showCommandPalette(payload))
	commands.on("command-palette.hide", hideCommandPalette)

	return commandPalette$
})

export const useCommandPalette = () => ({
	show: showCommandPalette,
	hide: hideCommandPalette,
	addItem: registerCommandPaletteItem,
	removeItem: unregisterCommandPaletteItem,
})

// TODO: Rename to reflect difference between command palette and search
export const useDefaultCommandPalette = () => {
	const items = useSubscription(commandPalette$)
	const { showModal, hideModal } = useModal()

	useEffect(() => {
		if (!items || !items.length) return

		showModal(() => <CommandPaletteModal items={items} />, {
			showCloseButton: false,
			onHide: () => hideCommandPalette(),
		})
	}, [items, showModal, hideModal])

	return null
}

export const useCommandPaletteItems = () => useSubscription(commandPaletteItems$)
