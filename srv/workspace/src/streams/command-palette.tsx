import { BehaviorSubject, map, merge, scan, shareReplay, Subject } from "rxjs"
import { ComponentType, useEffect } from "react"
import { IconType } from "react-icons"
import { Thunk, Unary, callOnce } from "#lib/tau/mod"
import { useSubscription } from "$hooks/use-subscription"
import { getCommands } from "$streams/commands"
import { getModal } from "$streams/modal"
import CommandPaletteModal from "$components/command-palette"

const commands = getCommands()
const modal = getModal()

export type UnregisterCommandPaletteItemFn = Unary<string, void>
export type RegisterCommandPaletteItemFn = Unary<CommandPaletteItem, void>

export type CommandPaletteItem = {
	commandName: string
	readableName: string
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
	const exists = state.some(item => item.readableName === newContextMenuItem.readableName)

	return exists ? state : [...state, newContextMenuItem]
}

const remove = (id: string) => (state: CommandPaletteItem[]) =>
	state.filter(a => a.commandName !== id)

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
	modal.hide()
}

export const initCommandPalette = callOnce(() => {
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

	useEffect(() => {
		if (!items || !items.length) return

		modal.show(() => <CommandPaletteModal items={items} />, {
			showCloseButton: false,
			onHide: () => hideCommandPalette(),
		})
	}, [items])

	return null
}

export const useCommandPaletteItems = () => useSubscription(commandPaletteItems$)
