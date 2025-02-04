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

import { BsFileEarmarkRuled } from "@ordo-pink/frontend-icons"
import { TwoLetterLocale } from "@ordo-pink/locale"
import { create_function } from "@ordo-pink/core"

import { Database } from "./src/database.component"
import { type TColumnName } from "./src/database.types"

declare global {
	interface t {
		database: {
			columns: () => string
			file_association: {
				readable_name: () => string
				description: () => string
			}
			column_names: {
				name: () => string
				labels: () => string
				created_at: () => string
				updated_at: () => string
				size: () => string
				outgoing_links: () => string
				incoming_links: () => string
				parent: () => string
				created_by: () => string
			}
			sorting_modal: {
				context_menu: () => string
			}
			columns_modal: {
				context_menu: () => string
			}
		}
	}

	interface cmd {
		database: {
			show_sorting_modal: () => void
			show_columns_modal: () => void
			toggle_column: () => TColumnName
			toggle_sorting: () => TColumnName
		}
	}
}

export default create_function(
	"pink.ordo.database",
	{
		commands: [
			"cmd.application.add_translations",
			"cmd.application.command_palette.hide",
			"cmd.application.command_palette.show",
			"cmd.application.context_menu.add",
			"cmd.application.context_menu.hide",
			"cmd.application.context_menu.remove",
			"cmd.application.context_menu.show",
			"cmd.application.modal.hide",
			"cmd.application.modal.show",
			"cmd.application.router.navigate",
			"cmd.content.set",
			"cmd.database.toggle_column",
			"cmd.database.toggle_sorting",
			"cmd.functions.file_associations.register",
			"cmd.metadata.add_labels",
			"cmd.metadata.remove_labels",
			"cmd.metadata.rename",
			"cmd.metadata.set_property",
			"cmd.metadata.show_create_modal",
			"cmd.metadata.show_edit_label_modal",
			"cmd.metadata.show_edit_labels_palette",
			"cmd.metadata.show_edit_links_palette",
		],
		queries: [
			"metadata.$",
			"metadata.get_by_fsid",
			"metadata.get_children",
			"metadata.get_incoming_links",
			"metadata.get_outgoing_links",
			"metadata.get",
			"metadata.has_children",
		],
	},
	ctx => {
		const commands = ctx.commands

		commands.emit("cmd.application.add_translations", {
			lang: TwoLetterLocale.ENGLISH,
			translations: {
				"t.database.columns": "Columns",
				"t.database.column_names.created_at": "Creation Date",
				"t.database.column_names.labels": "Labels",
				"t.database.column_names.name": "Name",
				"t.database.column_names.size": "Size",
				"t.database.column_names.updated_at": "Last Updated",
				"t.database.file_association.readable_name": "Database",
				"t.database.column_names.created_by": "Author",
				"t.database.column_names.outgoing_links": "Outgoing Links",
				"t.database.column_names.incoming_links": "Incoming Links",
				"t.database.column_names.parent": "Parent",
				"t.database.columns_modal.context_menu": "Edit columns...",
				"t.database.sorting_modal.context_menu": "Edit sorting...",
				"t.database.file_association.description":
					"This file represents a database where each row is a separate file contained inside the database.",
			},
		})

		commands.emit("cmd.functions.file_associations.register", {
			name: "pink.ordo.database",
			types: [
				{
					name: "database/ordo",
					readable_name: "t.database.file_association.readable_name",
					description: "t.database.file_association.description",
				},
			],
			render: ({ metadata, content }) => Database(metadata, content),
			render_icon: BsFileEarmarkRuled,
		})
	},
)
