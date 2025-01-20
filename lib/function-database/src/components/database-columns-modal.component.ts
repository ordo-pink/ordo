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

import { DatabaseColumnModalItem } from "./database-columns-modal-item.component"
import { type TColumnName } from "../database.types"

export const DatabaseColumnsModal = Maoka.create("div", ({ use }) => {
	use(MaokaJabs.set_class("database_modal_columns"))

	const { t } = use(MaokaOrdo.Jabs.get_translations$)
	const commands = use(MaokaOrdo.Jabs.get_commands)

	const handle_dialog_action = () => commands.emit("cmd.application.modal.hide")
	const render_all_columns = () => ALL_COLUMNS.map(DatabaseColumnModalItem)

	return () => {
		const t_action_text = t("t.common.ok")
		const t_modal_title = t("t.database.columns")

		return Dialog({ action: handle_dialog_action, title: t_modal_title, action_text: t_action_text, body: render_all_columns })
	}
})

// --- Internal ---

// TODO Take columns from file content
const ALL_COLUMNS: TColumnName[] = [
	"t.database.column_names.name",
	"t.database.column_names.labels",
	"t.database.column_names.outgoing_links",
	"t.database.column_names.incoming_links",
	"t.database.column_names.parent",
	"t.database.column_names.created_at",
	"t.database.column_names.created_by",
]
