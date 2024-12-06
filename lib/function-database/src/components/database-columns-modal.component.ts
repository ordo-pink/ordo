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

import { Dialog } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { TDatabaseState } from "../database.types"

export const DatabaseColumnsModal = (state: TDatabaseState, on_change: (state: TDatabaseState) => void) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("w-96 max-w-full flex flex-col"))

		const { t } = use(MaokaOrdo.Jabs.Translations)
		const commands = use(MaokaOrdo.Jabs.Commands.get)

		const active_columns = state.columns ?? ["t.database.column_names.name"]
		const all_columns = [
			"t.database.column_names.name",
			"t.database.column_names.labels",
			"t.database.column_names.links",
			"t.database.column_names.parent",
			"t.database.column_names.created_at",
			"t.database.column_names.created_by",
		]

		return () => [
			Dialog({
				action: () => commands.emit("cmd.application.modal.hide"),
				title: "Columns",
				action_text: "OK",
				body: () =>
					all_columns.map(column =>
						Maoka.create("div", ({ use }) => {
							use(MaokaJabs.set_class("flex justify-between px-2 py-1 text-sm"))

							return () => [
								Maoka.create("div", () => () => t(column as Ordo.I18N.TranslationKey)),
								Maoka.create("input", ({ use }) => {
									use(MaokaJabs.set_attribute("type", "checkbox"))
									use(
										MaokaJabs.listen("onchange", () => {
											const state_copy = { ...state }

											if (!state_copy.columns) state_copy.columns = ["t.database.column_names.name"]
											if (state_copy.columns.includes(column)) state_copy.columns.splice(state_copy.columns.indexOf(column), 1)
											else state_copy.columns.push(column)

											if (!state_copy.columns.includes("t.database.column_names.name"))
												state_copy.columns.unshift("t.database.column_names.name")

											on_change(state_copy)
										}),
									)

									if (active_columns.includes(column)) use(MaokaJabs.set_attribute("checked"))
								}),
							]
						}),
					),
			}),
		]
	})
