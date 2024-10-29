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

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import "./input.css"

type TInputProps = {
	initial_value?: string
	on_input?: (event: Event) => void
	placeholder?: string
	label?: string
	custom_class?: string
	autofocus?: boolean
}
const Text = ({
	label = "",
	on_input = () => void 0,
	placeholder = "",
	initial_value = "",
	custom_class = "",
	autofocus = false,
}: TInputProps) =>
	Maoka.create("label", () => {
		return () => [
			Maoka.create("div", ({ use }) => {
				use(MaokaJabs.set_class("input_label"))
				return () => label
			}),

			Maoka.create("input", ({ use, element, after_mount }) => {
				use(MaokaJabs.listen("oninput", on_input))
				use(MaokaJabs.set_attribute("type", "text"))
				use(MaokaJabs.set_class("input_text", custom_class))

				if (initial_value) use(MaokaJabs.set_attribute("value", initial_value))
				if (placeholder) use(MaokaJabs.set_attribute("placeholder", placeholder))
				if (autofocus) after_mount(() => element instanceof HTMLElement && element.focus())
			}),
		]
	})

export const Input = {
	Text,
}
