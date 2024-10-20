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

import { Hotkey } from "./hotkey.component"

import "./button.css"

export type TButtonProps = {
	on_click: (event: MouseEvent) => void
	custom_class?: string
	accelerator?: string
	text: string
}

const Default = ({ on_click, accelerator, text, custom_class = "" }: TButtonProps) =>
	Maoka.create("button", ({ use, element }) => {
		use(MaokaJabs.set_class("button", custom_class))
		use(
			MaokaJabs.listen("onclick", event => {
				if (element instanceof HTMLButtonElement) element.focus()
				on_click(event)
			}),
		)

		return () => [TextContainer(() => text), accelerator ? Hotkey(accelerator) : void 0]
	})

const TextContainer = Maoka.styled("div")

const Success = (params: TButtonProps) =>
	Default({ ...params, custom_class: `success ${params.custom_class}` })

const Neutral = (params: TButtonProps) =>
	Default({ ...params, custom_class: `neutral ${params.custom_class}` })

const Primary = (params: TButtonProps) =>
	Default({ ...params, custom_class: `primary ${params.custom_class}` })

export const Button = {
	Neutral,
	Success,
	Primary,
}
