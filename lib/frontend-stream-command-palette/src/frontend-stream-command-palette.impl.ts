// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"
import { Subject } from "rxjs/internal/Subject"
import { map } from "rxjs/internal/operators/map"
import { merge } from "rxjs/internal/observable/merge"
import { scan } from "rxjs/internal/operators/scan"
import { shareReplay } from "rxjs/internal/operators/shareReplay"

import { call_once } from "@ordo-pink/tau"
import { _get_commands } from "@ordo-pink/frontend-stream-commands"
import { _get_logger } from "@ordo-pink/frontend-logger"

export const __init_command_palette$ = call_once((fid: symbol) => {
	const commands = _get_commands(fid)
	const logger = _get_logger(fid)

	logger.debug("Initializing command palette...")

	commands.on<cmd.commandPalette.show>("command-palette.show", show)
	commands.on<cmd.commandPalette.add>("command-palette.add", add)
	commands.on<cmd.commandPalette.remove>("command-palette.remove", remove)
	commands.on<cmd.commandPalette.hide>("command-palette.hide", () => {
		currentCommandPalette$.next({ items: [] })
		commands.emit<cmd.modal.hide>("modal.hide")
	})

	logger.debug("Initialized command palette.")
})

export type TCommandPaletteState = {
	items: Client.CommandPalette.Item[]
	onNewItem?: (newItem: string) => any
	multiple?: boolean
	pinnedItems?: Client.CommandPalette.Item[]
}

type Add = (item: Client.CommandPalette.Item) => void
type Remove = (id: string) => void
type Show = (state: TCommandPaletteState) => void
type AddP = (
	item: Client.CommandPalette.Item,
) => (state: TCommandPaletteState) => TCommandPaletteState
type RemoveP = (item: string) => (state: TCommandPaletteState) => TCommandPaletteState

export const currentCommandPalette$ = new BehaviorSubject<TCommandPaletteState>({ items: [] })

export const add: Add = item => add$.next(item)
export const remove: Remove = id => remove$.next(id)
export const show: Show = items => currentCommandPalette$.next(items)

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
export const globalCommandPalette$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), { items: [] } as {
		items: Client.CommandPalette.Item[]
		onNewItem?: (newItem: string) => any
	}),
	shareReplay(1),
)

globalCommandPalette$.subscribe()
