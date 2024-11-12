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

import { type Observable } from "rxjs"

import { BsMenuButtonWideFill } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { type TOption } from "@ordo-pink/option"

import { ActivityBarIcon } from "./activity-bar-icon.component"
import { ActivityBarLink } from "./activity-bar-link.component"

import "./activity-bar.css"

export const ActivityBar = (
	ctx: Ordo.CreateFunction.Params,
	ca$: Observable<TOption<Ordo.Activity.Instance>>,
	as$: Observable<Ordo.Activity.Instance[]>,
) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaOrdo.Context.provide(ctx))

		use(MaokaJabs.set_class("activity-bar"))
		use(MaokaJabs.listen("oncontextmenu", event => handle_context_menu(event)))

		const init_as = [] as Ordo.Activity.Instance[]
		const init_a = void 0
		const commands = use(MaokaOrdo.Jabs.Commands)
		const get_list = use(MaokaOrdo.Jabs.from$(as$, init_as))
		const get_current = use(MaokaOrdo.Jabs.from$(ca$, init_a, x => x.unwrap()))

		const handle_context_menu = (event: MouseEvent) => {
			event.preventDefault()
			commands.emit("cmd.application.context_menu.show", { event })
		}

		return () => {
			const activities = get_list()
			const current_activity = get_current()

			return [
				Maoka.create("span", ({ use }) => {
					use(MaokaJabs.set_class("activity-bar_link"))
					use(
						MaokaJabs.listen("onclick", event => {
							event.preventDefault()
							event.stopPropagation()

							commands.emit("cmd.application.command_palette.toggle")
						}),
					)

					return () =>
						ActivityBarIcon({
							name: "Command Palette",
							render_icon: span => void span.appendChild(BsMenuButtonWideFill() as SVGSVGElement),
						})
				}),
				...activities.map(
					({ name, routes, default_route, render_icon }) =>
						render_icon &&
						ActivityBarLink({
							name,
							routes,
							default_route,
							render_icon,
							current_activity_name: current_activity?.name,
						}),
				),
			]
		}
	})
