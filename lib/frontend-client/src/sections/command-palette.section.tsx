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

import { BsTerminal } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { type TLogger } from "@ordo-pink/logger"
import { call_once } from "@ordo-pink/tau"

import { CommandPalette } from "../components/command-palette"

export const init_command_palette = call_once(
	(logger: TLogger, commands: Ordo.Command.Commands, ctx: Ordo.CreateFunction.Params) => {
		logger.debug("🟡 Initialising command palette...")

		commands.on("cmd.application.command_palette.show", on_show_custom_cp(commands, ctx))
		commands.on("cmd.application.command_palette.hide", on_hide_custom_cp(commands))
		commands.on("cmd.application.command_palette.add", on_add_global_item)
		commands.on("cmd.application.command_palette.remove", on_remove_global_item)

		let on_toggle_cp = () => on_show_custom_cp(commands, ctx)({ items: [] })

		custom_command_palette$
			.pipe(combineLatestWith(global_command_palette$))
			.subscribe(([state, global]) => {
				commands.off("cmd.application.command_palette.toggle", on_toggle_cp)

				if (state.items.length > 0) {
					on_toggle_cp = on_hide_custom_cp(commands)
					commands.on("cmd.application.command_palette.toggle", on_toggle_cp)
				} else {
					on_toggle_cp = () => on_show_custom_cp(commands, ctx)(global)
					commands.on("cmd.application.command_palette.toggle", on_toggle_cp)
				}
			})

		commands.emit("cmd.application.command_palette.add", {
			on_select: () => commands.emit("cmd.application.command_palette.toggle"),
			readable_name: "t.common.components.command_palette.toggle",
			accelerator: "mod+shift+p",
			render_icon: div => div.appendChild(BsTerminal() as SVGSVGElement),
			description: "t.common.components.command_palette.toggle_description",
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

const custom_command_palette$ = new BehaviorSubject<Ordo.CommandPalette.Instance>({
	items: [],
})

const on_add_global_item = (item: Ordo.CommandPalette.Item) => add$.next(item)
const on_remove_global_item = (id: string) => remove$.next(id)
const on_show_custom_cp =
	(commands: Ordo.Command.Commands, ctx: Ordo.CreateFunction.Params) =>
	(state: Ordo.CommandPalette.Instance) => {
		commands.emit("cmd.application.modal.hide")
		custom_command_palette$.next(state)

		commands.emit("cmd.application.modal.show", {
			on_unmount: () => {
				custom_command_palette$.next({ items: [] })
			},
			show_close_button: false,
			render: div => {
				void Maoka.render_dom(div, CommandPalette(custom_command_palette$, ctx))
			},
		})
	}
const on_hide_custom_cp = (commands: Ordo.Command.Commands) => () => {
	commands.emit("cmd.application.modal.hide")
}

type AddP = (
	item: Ordo.CommandPalette.Item,
) => (state: Ordo.CommandPalette.Instance) => Ordo.CommandPalette.Instance
const addP: AddP = item => state =>
	state.items.some(({ readable_name }) => readable_name === item.readable_name)
		? state
		: { ...state, items: [...state.items, item] }

type RemoveP = (
	item: string,
) => (state: Ordo.CommandPalette.Instance) => Ordo.CommandPalette.Instance
const removeP: RemoveP = id => state => ({
	...state,
	items: state.items.filter(a => a.readable_name !== id),
})

const add$ = new Subject<Ordo.CommandPalette.Item>()
const remove$ = new Subject<string>()
const global_command_palette$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), { items: [] } as {
		items: Ordo.CommandPalette.Item[]
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

	hotkey += event.key.toLocaleLowerCase()

	return hotkey
}

const on_input =
	(global_command_palette: Ordo.CommandPalette.Instance) => (event: KeyboardEvent) => {
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
