// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BehaviorSubject, map, merge, Observable, scan, shareReplay, Subject } from "rxjs"
import { BsCommand } from "react-icons/bs"
import { Binary, Curry, Nullable, Thunk, Unary, callOnce } from "@ordo-pink/tau/mod"
import { Logger } from "@ordo-pink/logger/mod"
import { getCommands } from "$streams/commands"
import { CommandPalette, cmd } from "@ordo-pink/libfe/mod"

// TODO: Merge commands, command palette and context menu item creation

const commands = getCommands()

export type __CommandPalette$ = Observable<CommandPalette.Item[]>
export const __initCommandPalette: InitCommandPalette = callOnce(({ logger }) => {
	logger.debug("Initializing command palette")

	commands.on<cmd.commandPalette.show>("command-palette.show", ({ payload }) => show(payload))
	commands.on<cmd.commandPalette.add>("command-palette.add", ({ payload }) => add(payload))
	commands.on<cmd.commandPalette.remove>("command-palette.remove", ({ payload }) => remove(payload))
	commands.on<cmd.commandPalette.hide>("command-palette.hide", hide)

	add({
		id: "command-palette.hide",
		onSelect: hide,
		readableName: "Hide command palette",
		Icon: BsCommand,
		accelerator: "mod+shift+p",
	})

	return { globalCommandPalette$, currentCommandPalette$ }
})

type Add = Unary<CommandPalette.Item, void>
type Remove = Unary<string, void>
type Show = Unary<CommandPalette.Item[], void>
type Hide = Thunk<void>
type AddP = Curry<Binary<CommandPalette.Item, CommandPalette.Item[], CommandPalette.Item[]>>
type RemoveP = Curry<Binary<string, CommandPalette.Item[], CommandPalette.Item[]>>
type InitCommandPaletteP = { logger: Logger }
type InitCommandPaletteR = {
	globalCommandPalette$: Nullable<__CommandPalette$>
	currentCommandPalette$: Nullable<__CommandPalette$>
}
type InitCommandPalette = Unary<InitCommandPaletteP, InitCommandPaletteR>

const currentCommandPalette$ = new BehaviorSubject<CommandPalette.Item[]>([])

export const add: Add = item => add$.next(item)
export const remove: Remove = id => remove$.next(id)
export const show: Show = items => currentCommandPalette$.next(items)
export const hide: Hide = () => {
	currentCommandPalette$.next([])
	commands.emit<cmd.modal.hide>("modal.hide")
}

const addP: AddP = item => state =>
	state.some(({ id: commandName }) => commandName === item.id) ? state : [...state, item]
const removeP: RemoveP = id => state => state.filter(a => a.id !== id)

const add$ = new Subject<CommandPalette.Item>()
const remove$ = new Subject<string>()
const globalCommandPalette$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), [] as CommandPalette.Item[]),
	shareReplay(1),
)

globalCommandPalette$.subscribe()
