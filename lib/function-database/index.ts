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
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStr } from "@ordo-pink/maoka-render-string"
import { Result } from "@ordo-pink/result"
import { TwoLetterLocale } from "@ordo-pink/locale"
import { create_function } from "@ordo-pink/core"
import { invokers0 } from "@ordo-pink/oath"

import { Database } from "./src/database.component"
import { type TColumnName } from "./src/database.types"

import core_styles from "@ordo-pink/frontend-app/index.css?inline"
import db_styles from "./src/database.css?inline"
import maoka_components from "@ordo-pink/maoka-components/maoka-components.css?inline"

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
			"content.get",
			"application.fetch",
			"user.get_current",
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
			render: ({ metadata, content, is_editable }) => Database(metadata, content, is_editable),
			render_icon: BsFileEarmarkRuled,
		})

		commands.on("cmd.metadata.publish", ({ fsid }) => {
			const content_query = ctx.content_query
			const metadata_query = ctx.metadata_query
			const metadata = metadata_query.get_by_fsid(fsid).cata(Result.catas.or_else(() => null))
			const user = ctx.user_query.get_current().cata(Result.catas.or_else(() => null))

			if (!user || !metadata || metadata.get_type() !== "database/ordo") return // Log cannot publish if unauthed error

			void content_query
				.get(user.get_id(), fsid)
				.and(content => MaokaOrdo.Components.WithState(ctx, () => Database(metadata, content, false)))
				.and(cmp => MaokaOrdo.Components.WithState(ctx, () => cmp))
				.and(cmp => MaokaStr.render(MaokaStr.create_element("div"), cmp))
				.and(
					str => `<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${metadata.get_name()}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="icon" href="/favicon.ico" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"
/>
<style>
${core_styles}
${maoka_components}
${db_styles}
</style>
</head>
<body>
${str}
</body>
</html>`,
				)
				.and(console.log)
				.invoke(invokers0.to_promise)
		})
	},
)
