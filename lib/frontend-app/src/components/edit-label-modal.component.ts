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

import { Dialog, Input, Select, color_class } from "@ordo-pink/maoka-components"
import { is_non_empty_string, title_case } from "@ordo-pink/tau"
import { LabelColor } from "@ordo-pink/core"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const EditLabelModal = (label: Ordo.Metadata.Label) =>
	Maoka.create("div", ({ use }) => {
		const commands = use(MaokaOrdo.Jabs.get_commands)

		const initial_name = label.name
		const initial_color = label.color

		let name = initial_name
		let color = initial_color

		const color_items = color_class.slice(0, -1).map((_, i) => ({
			title: title_case(LabelColor[i]),
			value: i as LabelColor,
			render_info: () => LabelCircle(i),
		}))

		const current_color = color_items.find(item => item.value === label.color) ?? color_items[0] // TODO Log error, this is wrong

		return () =>
			Dialog({
				title: `Edit label "${initial_name}"`, // TODO Translations
				action: () => {
					commands.emit("cmd.metadata.edit_label", {
						old_label: label,
						new_label: { color, name },
					})

					commands.emit("cmd.application.modal.hide")
				},
				action_hotkey: "enter",
				action_text: "Save",
				body: () =>
					Maoka.create("div", ({ use }) => {
						use(MaokaJabs.set_class("flex flex-col gap-2"))
						return () => [
							Input.Text({
								autofocus: true,
								initial_value: name,
								label: "Edit label name", // TODO Translations
								on_input: event => {
									const target = event.target as HTMLInputElement
									name = target.value
								},
								validate: is_non_empty_string,
								validation_error_message: "Can't be empty", // TODO Translations
								required: true,
								placeholder: "hashtag101",
							}),
							// TODO Color select (extract select from create modal to separate component)
							Select({
								current_value: current_color,
								items: color_items,
								on_select: value => {
									color = value
								},
							}),
						]
					}),
			})
	})

const LabelCircle = (color: LabelColor) =>
	Maoka.styled("div", { class: `label ${color_class[color]} size-3 !rounded-full` })(() => {})
