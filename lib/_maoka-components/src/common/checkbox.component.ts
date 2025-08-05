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

import { Maoka } from "@ordo-pink/oss-maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"

import "../../maoka-components.css"

export type TCheckboxParams = {
	on_change: (event: Event) => void
	checked?: boolean
}
export const Checkbox = ({ on_change, checked }: TCheckboxParams) =>
	Maoka.create("input", ({ use }) => {
		use(maoka_jabs.set_attribute("type", "checkbox"))
		use(maoka_jabs.listen("onchange", on_change))
		use(maoka_jabs.set_class("checkbox"))

		if (checked) use(maoka_jabs.set_attribute("checked"))
	})

export type TCheckboxInputParams = {
	on_change: (event: Event) => void
	checked?: boolean
	label?: string
}
export const CheckboxInput = ({ on_change, checked, label }: TCheckboxInputParams) =>
	Maoka.create("label", ({ use }) => {
		use(maoka_jabs.set_class("checkbox-label"))

		return () => [Checkbox({ on_change, checked }), LabelText(() => () => label)]
	})

const LabelText = MaokaStyled.Tags.span("block")
