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

import { BehaviorSubject, Subject, combineLatestWith, map, merge, scan, shareReplay } from "rxjs"
import { Root, createRoot } from "react-dom/client"
import { BsCommand } from "react-icons/bs"

import { type TLogger } from "@ordo-pink/logger"
import { call_once } from "@ordo-pink/tau"

import CommandPaletteModal from "./command-palette.component"
import { TOrdoContext } from "@ordo-pink/core"
import { create_ordo_context } from "@ordo-pink/frontend-react-hooks"

export const init_command_palette = call_once(
	(logger: TLogger, commands: Client.Commands.Commands, ctx: TOrdoContext) => {
		logger.debug("🟡 Initialising command palette...")

		commands.on("cmd.application.command_palette.show", on_show_custom_cp(commands, ctx))
		commands.on("cmd.application.command_palette.hide", on_hide_custom_cp(commands))
		commands.on("cmd.application.command_palette.add", on_add_global_item)
		commands.on("cmd.application.command_palette.remove", on_remove_global_item)

		let on_toggle_cp = () => {
			console.log("HERE")
			on_show_custom_cp(commands, ctx)
		}

		custom_command_palette$
			.pipe(combineLatestWith(global_command_palette$))
			.subscribe(([state, global]) => {
				if (state.items.length > 0) {
					commands.off("cmd.application.command_palette.toggle", on_toggle_cp)
					on_toggle_cp = () => {
						console.log("THERE")
						on_hide_custom_cp(commands)()
					}
					commands.on("cmd.application.command_palette.toggle", on_toggle_cp)
				} else {
					commands.off("cmd.application.command_palette.toggle", on_toggle_cp)
					on_toggle_cp = () => {
						console.log("THEN")
						on_show_custom_cp(commands, ctx)(global)
					}
					commands.on("cmd.application.command_palette.toggle", on_toggle_cp)
				}
			})

		commands.emit("cmd.application.command_palette.add", {
			id: "command_palette.hide",
			on_select: () => commands.emit("cmd.application.command_palette.toggle"),
			readable_name: "t.common.components.command_palette.toggle",
			Icon: BsCommand,
			accelerator: "mod+shift+p",
		})

		let on_keydown: (event: KeyboardEvent) => void

		global_command_palette$.subscribe(global_command_palette => {
			if (on_keydown) document.removeEventListener("keydown", on_keydown)
			on_keydown = on_input(global_command_palette)

			document.addEventListener("keydown", on_keydown)
		})

		logger.debug("🟢 Initialised command palette.")
	},
)

export type TCommandPaletteState = {
	items: Client.CommandPalette.Item[]
	on_new_item?: (new_item: string) => any
	multiple?: boolean
	pinned_items?: Client.CommandPalette.Item[]
}

const custom_command_palette$ = new BehaviorSubject<TCommandPaletteState>({ items: [] })

const Provider = create_ordo_context()

const on_add_global_item = (item: Client.CommandPalette.Item) => add$.next(item)
const on_remove_global_item = (id: string) => remove$.next(id)
const on_show_custom_cp =
	(commands: Client.Commands.Commands, ctx: TOrdoContext) => (state: TCommandPaletteState) => {
		let root: Root

		custom_command_palette$.next(state)
		commands.emit("cmd.application.modal.show", {
			on_unmount: () => {
				root.unmount()
				custom_command_palette$.next({ items: [] })
			},
			show_close_button: false,
			render: div => {
				root = createRoot(div)

				// TODO: Drop React
				root.render(
					<Provider value={ctx}>
						<CommandPaletteModal
							items={state.items}
							multiple={state.multiple}
							on_new_item={state.on_new_item}
							pinned_items={state.pinned_items}
						/>
					</Provider>,
				)
			},
		})
	}
const on_hide_custom_cp = (commands: Client.Commands.Commands) => () => {
	commands.emit("cmd.application.modal.hide")
}

type AddP = (
	item: Client.CommandPalette.Item,
) => (state: TCommandPaletteState) => TCommandPaletteState
const addP: AddP = item => state =>
	state.items.some(({ id: commandName }) => commandName === item.id)
		? state
		: { ...state, items: [...state.items, item] }

type RemoveP = (item: string) => (state: TCommandPaletteState) => TCommandPaletteState
const removeP: RemoveP = id => state => ({
	...state,
	items: state.items.filter(a => a.id !== id),
})

const add$ = new Subject<Client.CommandPalette.Item>()
const remove$ = new Subject<string>()
const global_command_palette$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), { items: [] } as {
		items: Client.CommandPalette.Item[]
		on_new_item?: (new_item: string) => any
	}),
	shareReplay(1),
)

global_command_palette$.subscribe()

const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]

const create_hotkey_string = (event: KeyboardEvent, isApple: boolean) => {
	let hotkey = ""

	if (event.altKey) hotkey += "meta+"
	if (event.ctrlKey) hotkey += isApple ? "ctrl+" : "mod+"
	if (event.metaKey) hotkey += "mod+"
	if (event.shiftKey) hotkey += "shift+"

	hotkey += event.code.replace("Key", "").toLocaleLowerCase()

	return hotkey
}

const on_input = (global_command_palette: TCommandPaletteState) => (event: KeyboardEvent) => {
	if (IGNORED_KEYS.includes(event.key)) return

	const hotkey = create_hotkey_string(event, false)

	const command = global_command_palette.items.find(
		item => item.accelerator && item.accelerator === hotkey,
	)

	if (command) {
		event.preventDefault()
		event.stopPropagation()

		command.on_select()
	}
}
