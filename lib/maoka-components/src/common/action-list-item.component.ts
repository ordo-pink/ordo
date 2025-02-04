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

import { Maoka, type TMaokaChildren } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import "./action-list-item.css"

export type TActionListItemProps = {
	title: string
	is_current?: boolean | "hover"
	on_click?: (event: MouseEvent) => void
	render_icon?: () => TMaokaChildren | Promise<TMaokaChildren>
	render_footer?: () => TMaokaChildren | Promise<TMaokaChildren>
	render_info?: () => TMaokaChildren | Promise<TMaokaChildren>
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
			if (is_current === true) use(MaokaJabs.add_class("active"))
			else if (is_current === "hover") use(MaokaJabs.add_class("active-hover"))
			else use(MaokaJabs.remove_class("active", "active-hover"))

			return Layout(() => [
				Main(() => [Icon(render_icon), Title(() => title), Info(render_info)]),
				render_footer ? Footer(async () => render_footer()) : void 0,
			])
		}
	})

const Title = Maoka.styled("div", { class: "action-list-item_title" })
const Layout = Maoka.styled("div", { class: "action-list-item_layout" })
const Main = Maoka.styled("div", { class: "action-list-item_main" })
const Footer = Maoka.styled("div", { class: "action-list-item_footer" })

const Info = (render_info?: () => TMaokaChildren | Promise<TMaokaChildren>) =>
	Maoka.create("div", () => async () => render_info && render_info())

const Icon = (render_icon?: () => TMaokaChildren | Promise<TMaokaChildren>) =>
	Maoka.create("div", () => async () => render_icon && render_icon())
