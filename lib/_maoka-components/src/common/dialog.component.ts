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

import { maoka, type Maoka } from "@ordo-pink/oss-maoka"
import { button } from "@ordo-pink/_maoka-components"
import { maoka_jabs } from "@ordo-pink/_maoka-jabs"

import "../../maoka-components.css"

type TDialogParams = {
	title: string
	custom_class?: string
	render_icon?: (() => Maoka.Children) | (() => Promise<Maoka.Children>)
	body: () => Maoka.Children
	action: () => void | Promise<void>
	action_text: string
	action_hotkey?: string
	action_disabled?: () => boolean
}

export const Dialog = ({
	title,
	custom_class = "",
	body,
	action,
	render_icon,
	action_text,
	action_hotkey,
	action_disabled = () => false,
}: TDialogParams) =>
	maoka.create("div", ({ use }) => {
		use(maoka_jabs.set_class("dialog", custom_class))

		const Icon = render_icon ? maoka.create("div", () => render_icon) : void 0

		return () => [
			Header(() => [Icon, Title(() => title)]),
			Body(body),
			Footer(
				() => () =>
					Button.Success({
						on_click: action,
						text: action_text,
						hotkey: action_hotkey,
						disabled: action_disabled,
					}),
			),
		]
	})

const Header = styled.div("dialog_header")
const Title = styled.h2("dialog_title")
const Body = styled.div()
const Footer = styled.div("dialog_footer")
