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

import { ActionListItem } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import "./context-menu.css"

export const ContextMenu = (
	ctx: Ordo.CreateFunction.Params,
	$: Observable<Ordo.ContextMenu.Instance | null>,
) =>
	Maoka.create("div", ({ use, on_unmount }) => {
		use(MaokaOrdo.Context.provide(ctx))

		const { emit } = use(MaokaOrdo.Jabs.Commands)
		const get_state = use(MaokaOrdo.Jabs.from$($, null, state => state))

		const handle_click_outside = () => emit("cmd.application.context_menu.hide")

		document.addEventListener("click", handle_click_outside)
		on_unmount(() => document.removeEventListener("click", handle_click_outside))

		return () => {
			const state = get_state()

			if (!state) return

			const fits_width = state.event.clientX <= window.innerWidth - 320
			const fits_height = state.event.clientY <= window.innerHeight - 400

			const left = fits_width ? `${state.event.clientX}px` : ""
			const top = fits_height ? `${state.event.clientY}px` : ""
			const right = fits_width ? "" : `${window.innerWidth - state.event.clientX}px`
			const bottom = fits_height ? "" : `${window.innerHeight - state.event.clientY}px`

			use(MaokaJabs.set_class("context-menu"))
			use(MaokaJabs.set_style({ left, top, right, bottom }))

			return state.structure
				.filter(item => item.should_show({ event: state.event, payload: state.payload }))
				.map(item => ContextMenuItem(item, state.payload, state.event))
		}
	})

const ContextMenuItem = (item: Ordo.ContextMenu.Item, payload: any, event: MouseEvent) =>
	Maoka.create("div", ({ use }) => {
		const { emit } = use(MaokaOrdo.Jabs.Commands)
		const { t } = use(MaokaOrdo.Jabs.Translations)

		return () =>
			ActionListItem({
				title: t(item.readable_name),
				is_current: "hover",
				on_click: () => {
					const current_payload = item.payload_creator
						? item.payload_creator({ event, payload })
						: payload

					emit(item.command, current_payload)
				},
				render_icon: item.render_icon,
			})
	})
