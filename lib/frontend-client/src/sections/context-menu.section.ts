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

import {
	BehaviorSubject,
	Observable,
	Subject,
	combineLatestWith,
	map,
	merge,
	scan,
	shareReplay,
} from "rxjs"

import { N, extend } from "@ordo-pink/tau"
import { Maoka } from "@ordo-pink/maoka"
import { R } from "@ordo-pink/result"
import { type TLogger } from "@ordo-pink/logger"

import { ContextMenu } from "../components/context-menu"

export const init_context_menu = (
	logger: TLogger,
	commands: Ordo.Command.Commands,
	ctx: Ordo.CreateFunction.Params,
) => {
	logger.debug("🟡 Initialising context menu...")

	custom_context_menu$.subscribe()
	global_context_menu$.subscribe()

	commands.on("cmd.application.context_menu.show", menu => custom_context_menu$.next(menu))
	commands.on("cmd.application.context_menu.hide", () => custom_context_menu$.next(null))
	commands.on("cmd.application.context_menu.add", item => add$.next(item))
	commands.on("cmd.application.context_menu.remove", name => remove$.next(name))

	const context_menu_element = document.querySelector("#context-menu") as HTMLDivElement

	void Maoka.render_dom(context_menu_element, ContextMenu(ctx, context_menu$))

	logger.debug("🟢 Initialised context menu.")
}

// --- Internal ---

const add_p = (item: Ordo.ContextMenu.Item) => (state: Ordo.ContextMenu.Item[]) =>
	state.filter(i => i.command !== item.command).concat([item])

const remove_p = (name: string) => (state: Ordo.ContextMenu.Item[]) =>
	state.filter(item => item.command !== name)

const add$ = new Subject<Ordo.ContextMenu.Item>()
const remove$ = new Subject<string>()
const custom_context_menu$ = new BehaviorSubject<Ordo.ContextMenu.Params | null>(null)
const global_context_menu$ = merge(add$.pipe(map(add_p)), remove$.pipe(map(remove_p))).pipe(
	scan((acc, f) => f(acc), [] as Ordo.ContextMenu.Item[]),
	shareReplay(1),
)

const context_menu$: Observable<Ordo.ContextMenu.Instance | null> = custom_context_menu$.pipe(
	combineLatestWith(global_context_menu$),
	map(([state, items]) =>
		R.FromNullable(state)
			.pipe(R.ops.chain(state => R.FromNullable(items).pipe(R.ops.map(() => state))))
			.cata({
				Err: N,
				Ok: extend(state => ({
					structure: items.filter(item => {
						const should_show =
							item?.should_show({ event: state.event, payload: state.payload }) ?? false

						// Avoid showing native context menu if there is something to show
						if (should_show && state.event.stopPropagation) state.event.stopPropagation()

						return should_show
					}),
				})),
			}),
	),
)
