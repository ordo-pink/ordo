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
import { Button } from "@ordo-pink/maoka-components"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import "./dialog.css"

type TDialogParams = {
	title: string
	custom_class?: string
	render_icon?: (div: HTMLDivElement) => void
	body: () => TMaokaChildren
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
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("dialog", custom_class))

		const Icon = render_icon ? Maoka.create("div", ({ element }) => render_icon(element as unknown as HTMLDivElement)) : void 0

		return () => [
			Header(() => [Icon, Title(() => title)]),
			Body(body),
			Footer(() =>
				Button.Success({
					on_click: action,
					text: action_text,
					hotkey: action_hotkey,
					disabled: action_disabled,
				}),
			),
		]
	})

const Header = Maoka.styled("div", { class: "dialog_header" })
const Title = Maoka.styled("h2", { class: "dialog_title" })
const Body = Maoka.styled("div")
const Footer = Maoka.styled("div", { class: "dialog_footer" })
