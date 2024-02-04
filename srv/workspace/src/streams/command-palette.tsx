// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BehaviorSubject, map, merge, Observable, scan, shareReplay, Subject } from "rxjs"
import { BsCommand } from "react-icons/bs"
import { Binary, Curry, Thunk, Unary, callOnce } from "@ordo-pink/tau"
import { Logger } from "@ordo-pink/logger"
import { getCommands } from "$streams/commands"

const commands = getCommands()

export type __CommandPalette$ = Observable<{
	items: Client.CommandPalette.Item[]
	onNewItem?: (newItem: string) => any
	multiple?: boolean
	pinnedItems?: Client.CommandPalette.Item[]
}>
export const __initCommandPalette: InitCommandPalette = callOnce(({ logger }) => {
	logger.debug("Initializing command palette")

	commands.on<cmd.commandPalette.show>("command-palette.show", ({ payload }) => show(payload))
	commands.on<cmd.commandPalette.add>("command-palette.add", ({ payload }) => add(payload))
	commands.on<cmd.commandPalette.remove>("command-palette.remove", ({ payload }) => remove(payload))
	commands.on<cmd.commandPalette.hide>("command-palette.hide", hide)

	add({
		id: "command-palette.hide",
		onSelect: hide,
		readableName: "Скрыть панель команд",
		Icon: BsCommand,
		accelerator: "mod+shift+p",
	})

	return { globalCommandPalette$, currentCommandPalette$ }
})

type Add = Unary<Client.CommandPalette.Item, void>
type Remove = Unary<string, void>
type Show = Unary<
	{
		items: Client.CommandPalette.Item[]
		onNewItem?: (newItem: string) => any
		multiple?: boolean
		pinnedItems?: Client.CommandPalette.Item[]
	},
	void
>
type Hide = Thunk<void>
type AddP = Curry<
	Binary<
		Client.CommandPalette.Item,
		{
			items: Client.CommandPalette.Item[]
			onNewItem?: (newItem: string) => any
			multiple?: boolean
			pinnedItems?: Client.CommandPalette.Item[]
		},
		{
			items: Client.CommandPalette.Item[]
			onNewItem?: (newItem: string) => any
			multiple?: boolean
			pinnedItems?: Client.CommandPalette.Item[]
		}
	>
>
type RemoveP = Curry<
	Binary<
		string,
		{
			items: Client.CommandPalette.Item[]
			onNewItem?: (newItem: string) => any
			multiple?: boolean
			pinnedItems?: Client.CommandPalette.Item[]
		},
		{
			items: Client.CommandPalette.Item[]
			onNewItem?: (newItem: string) => any
			multiple?: boolean
			pinnedItems?: Client.CommandPalette.Item[]
		}
	>
>
type InitCommandPaletteP = { logger: Logger }
type InitCommandPaletteR = {
	globalCommandPalette$: __CommandPalette$ | null
	currentCommandPalette$: __CommandPalette$ | null
}
type InitCommandPalette = Unary<InitCommandPaletteP, InitCommandPaletteR>

const currentCommandPalette$ = new BehaviorSubject<{
	items: Client.CommandPalette.Item[]
	onNewItem?: (newItem: string) => any
}>({ items: [] })

export const add: Add = item => add$.next(item)
export const remove: Remove = id => remove$.next(id)
export const show: Show = items => currentCommandPalette$.next(items)
export const hide: Hide = () => {
	currentCommandPalette$.next({ items: [] })
	commands.emit<cmd.modal.hide>("modal.hide")
}

const addP: AddP = item => state =>
	state.items.some(({ id: commandName }) => commandName === item.id)
		? state
		: { ...state, items: [...state.items, item] }
const removeP: RemoveP = id => state => ({
	...state,
	items: state.items.filter(a => a.id !== id),
})

const add$ = new Subject<Client.CommandPalette.Item>()
const remove$ = new Subject<string>()
const globalCommandPalette$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), { items: [] } as {
		items: Client.CommandPalette.Item[]
		onNewItem?: (newItem: string) => any
	}),
	shareReplay(1),
)

globalCommandPalette$.subscribe()
