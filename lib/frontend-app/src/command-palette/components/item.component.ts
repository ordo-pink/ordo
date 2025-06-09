/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { components, jabs } from "@ordo-pink/sdk-maoka"
import { maoka, maoka_dom, maoka_styled } from "@ordo-pink/maoka"
import type { Client } from "@ordo-pink/sdk-client"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

export const command_palette_item = maoka.create<{ item: Client.CommandPalette.Item.Instance; active: boolean }>(
	"div",
	({ active, item, use }) => {
		const handle_click = () => item.value()
		const t_name = use(jabs.translate$(item.readable_name))
		const t_description = use(jabs.translate$(item.description))

		use(maoka_jabs.set_id(String(item.id)))
		use(maoka_jabs.set_class("command-palette_item"))
		use(maoka_jabs.listen("onclick", handle_click))

		if (active) use(maoka_jabs.add_class("active"))
		else use(maoka_jabs.remove_class("active"))

		return () => {
			use(maoka_jabs.set_attribute("title", t_description()))

			return [
				item_main(() => [
					item_title(() => [item.render_icon && item_icon({ render: item.render_icon }), t_name()]),
					item.hotkey && item_info(() => components.hotkey({ hotkey: item.hotkey!, decoration_only: true })),
				]),
				item_footer(() => t_description()),
			]
		}
	},
)

const item_title = maoka_styled.div("command-palette_item_title-wrapper")
const item_info = maoka_styled.div("command-palette_item_info")
const item_main = maoka_styled.div("command-palette_item_main")
const item_footer = maoka_styled.div("command-palette_item_footer")
const item_icon = maoka_styled.span<{ render: Client.CommandPalette.RenderIcon }>(
	"command-palette_item_icon",
	({ render, use }) => use(maoka_dom.jabs.if_dom(n => void render(n.value))),
)
