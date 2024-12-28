/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ActionListItem, Hotkey } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { ordo_app_state } from "@ordo-pink/frontend-app/app.state"

export const OrdoCommandPaletteItem = (item: Ordo.CommandPalette.Item, on_click: () => void, is_current: boolean) =>
	Maoka.create("div", ({ element, after_mount }) => {
		const t = ordo_app_state.zags.select("translate")

		const title = t(item.readable_name)
		const render_info = item.render_custom_info
			? item.render_custom_info
			: item.hotkey
				? () => Hotkey(item.hotkey!, { prevent_in_inputs: true, smol: true })
				: void 0

		const render_footer = item.render_custom_footer
			? item.render_custom_footer
			: item.description
				? () => Description(() => t(item.description!))
				: void 0

		after_mount(() => {
			if (is_current && !is_in_view(element as Element, element.parentElement!))
				element.scrollIntoView?.({ behavior: "smooth", inline: "center", block: "center" })
		})

		return () => ActionListItem({ title, is_current, render_info, render_icon: item.render_icon, on_click, render_footer })
	})

const Description = Maoka.styled("div", { class: "text-xs text-neutral-600 dark:text-neutral-400" })

// TODO Move to tau/client
const is_in_view = (element: Element, wrapper: Element) => {
	const { left, top, bottom, right } = element.getBoundingClientRect()

	return top >= 0 && left >= 0 && bottom <= wrapper?.clientHeight && right <= wrapper?.clientWidth
}
