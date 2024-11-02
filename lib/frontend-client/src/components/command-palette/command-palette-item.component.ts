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

import { ActionListItem, Hotkey } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const CommandPaletteItem = (
	{
		readable_name,
		on_select,
		hotkey,
		description,
		render_icon,
		render_custom_footer,
		render_custom_info,
	}: Ordo.CommandPalette.Item,
	is_current: boolean,
) =>
	Maoka.create("div", ({ use, element, after_mount }) => {
		const { t } = use(MaokaOrdo.Jabs.Translations)
		const { emit } = use(MaokaOrdo.Jabs.Commands)

		const title = t(readable_name)
		const render_info = render_custom_info
			? render_custom_info
			: hotkey
				? () => Hotkey(hotkey, { prevent_in_inputs: true })
				: void 0

		const render_footer = render_custom_footer
			? render_custom_footer
			: description
				? () => Description(() => t(description))
				: void 0

		const on_click = () => {
			emit("cmd.application.command_palette.hide")
			on_select()
		}

		after_mount(() => {
			if (is_current && !is_in_view(element as Element, element.parentElement!))
				element.scrollIntoView?.({ behavior: "smooth", inline: "center", block: "center" })
		})

		return () =>
			ActionListItem({
				title,
				is_current,
				render_info,
				render_icon,
				on_click,
				render_footer,
			})
	})

const Description = Maoka.styled("div", { class: "text-xs text-neutral-600 dark:text-neutral-400" })

// TODO Move to tau/client
const is_in_view = (element: Element, wrapper: Element) => {
	const rect = element.getBoundingClientRect()

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= wrapper?.clientHeight /* or $(window).height() */ &&
		rect.right <= wrapper?.clientWidth /* or $(window).width() */
	)
}