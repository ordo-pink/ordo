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

import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { type TMaokaChildren } from "@ordo-pink/oss-maoka"

import "../../maoka-components.css"

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
	Item(({ use }) => {
		use(maoka_jabs.listen("onclick", on_click))

		return () => {
			if (is_current === true) use(maoka_jabs.add_class("active"))
			else if (is_current === "hover") use(maoka_jabs.add_class("active-hover"))
			else use(maoka_jabs.remove_class("active", "active-hover"))

			return Layout(() => () => [
				Main(() => () => [Icon(render_icon), Title(() => () => title), Info(render_info)]),
				render_footer ? Footer(() => async () => render_footer()) : void 0,
			])
		}
	})

const Item = MaokaStyled.Tags.div("action-list-item")
const Title = MaokaStyled.Tags.div("action-list-item_title")
const Layout = MaokaStyled.Tags.div("action-list-item_layout")
const Main = MaokaStyled.Tags.div("action-list-item_main")
const Footer = MaokaStyled.Tags.div("action-list-item_footer")
const Div = MaokaStyled.Tags.div()

const Info = (render_info?: () => TMaokaChildren | Promise<TMaokaChildren>) =>
	Div(() => async () => render_info && render_info())

const Icon = (render_icon?: () => TMaokaChildren | Promise<TMaokaChildren>) =>
	Div(() => async () => render_icon && render_icon())
