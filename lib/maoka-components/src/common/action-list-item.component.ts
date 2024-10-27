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

import { Maoka, TMaokaComponent } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import "./action-list-item.css"

export type TActionListItemProps = {
	title: string
	is_current?: boolean
	on_click?: (event: MouseEvent) => void
	render_icon?: (div: HTMLDivElement) => void
	render_footer?: () => TMaokaComponent
	render_info?: () => TMaokaComponent
}

export const ActionListItem = ({
	title,
	is_current = false,
	render_info,
	render_icon,
	render_footer,
	on_click = () => void 0,
}: TActionListItemProps) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("action-list-item"))
		use(MaokaJabs.listen("onclick", on_click))

		return () => {
			if (is_current) use(MaokaJabs.add_class("active"))
			else use(MaokaJabs.remove_class("active"))

			return Layout(() => [
				Main(() => [Icon(render_icon), Title(() => title), render_info?.()]),
				render_footer ? Footer(() => render_footer()) : void 0,
			])
		}
	})

const Title = Maoka.styled("div", { class: "action-list-item_title" })

const Layout = Maoka.styled("div", { class: "action-list-item_layout" })
const Main = Maoka.styled("div", { class: "action-list-item_main" })
const Footer = Maoka.styled("div", { class: "action-list-item_footer" })

const Icon = (render_icon?: (div: HTMLDivElement) => void) =>
	render_icon
		? Maoka.create("div", ({ element }) => {
				render_icon(element as unknown as HTMLDivElement)
			})
		: void 0
