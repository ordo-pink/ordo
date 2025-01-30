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

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { Hotkey, THotkeyOptions } from "./hotkey.component"

import "./button.css"

export type TButtonProps = {
	on_click: (event: MouseEvent) => void | Promise<void>
	text: string
	hotkey?: string
	hotkey_options?: THotkeyOptions
	custom_class?: string
	aria_label?: string
	disabled?: () => boolean
}

const Default = ({
	on_click,
	hotkey,
	text,
	aria_label = text,
	custom_class = "",
	hotkey_options,
	disabled = () => false,
}: TButtonProps) =>
	Maoka.create("button", ({ use, element }) => {
		use(MaokaJabs.set_class("button", custom_class))
		use(MaokaJabs.set_attribute("aria-label", aria_label))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const handle_click = (event: MouseEvent) => {
			if (element instanceof HTMLButtonElement) element.focus()
			return on_click(event)
		}

		return () => {
			if (disabled()) use(MaokaJabs.set_attribute("disabled"))
			else element?.removeAttribute?.("disabled") // TODO: Add jab

			return [TextContainer(() => text), hotkey ? Hotkey(hotkey, hotkey_options) : void 0]
		}
	})

const TextContainer = Maoka.styled("div")

const Success = (params: TButtonProps) => Default({ ...params, custom_class: add_button_spec("success", params.custom_class) })

const Neutral = (params: TButtonProps) => Default({ ...params, custom_class: add_button_spec("neutral", params.custom_class) })

const Primary = (params: TButtonProps) => Default({ ...params, custom_class: add_button_spec("primary", params.custom_class) })

export const Button = {
	Neutral,
	Success,
	Primary,
}

const add_button_spec = (button_spec: string, custom_class?: string): string => {
	if (!custom_class) return button_spec

	return `${button_spec} ${custom_class}`
}
