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

import { Dialog, Input } from "@ordo-pink/maoka-components"
import { BsFileEarmarkRichText } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const RenameFileModal = (fsid: Ordo.Metadata.FSID) =>
	Maoka.create("div", ({ use }) => {
		const { t } = use(MaokaOrdo.Jabs.get_translations$)
		const commands = use(MaokaOrdo.Jabs.get_commands)
		const get_metadata = use(MaokaOrdo.Jabs.Metadata.get_by_fsid$(fsid))

		const t_title = t("t.common.components.modals.rename_file.title")
		const t_input_label = t("t.common.components.modals.rename_file.input_label")

		const state = { name: "" }

		return () => {
			const metadata = get_metadata()

			state.name = metadata ? metadata.get_name() : ""

			return Dialog({
				title: t_title,
				action: () => {
					commands.emit("cmd.metadata.rename", { fsid, new_name: state.name })
					commands.emit("cmd.application.modal.hide")
				},
				action_hotkey: "enter",
				action_text: "OK", // TODO Add translations
				body: () =>
					Input.Text({
						autofocus: true,
						initial_value: state.name,
						label: t_input_label,
						on_input: event => {
							const target = event.target as HTMLInputElement
							state.name = target.value
						},
					}),
				render_icon: BsFileEarmarkRichText,
			})
		}
	})
