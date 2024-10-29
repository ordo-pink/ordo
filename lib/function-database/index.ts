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

import { BsFileEarmarkRuled } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { create_function } from "@ordo-pink/core"

import { Database } from "./src/database.component"

declare global {
	interface t {
		database: {
			file_association: {
				readable_name: () => string
				description: () => string
			}
		}
	}
}

export default create_function(
	"pink.ordo.database",
	{
		commands: [
			"cmd.functions.file_associations.add",
			"cmd.application.add_translations",
			"cmd.metadata.show_create_modal",
			"cmd.application.router.navigate",
			"cmd.application.command_palette.show",
			"cmd.application.context_menu.show",
			"cmd.metadata.rename",
			"cmd.content.set",
			"cmd.metadata.set_property",
			"cmd.application.command_palette.hide",
		],
		queries: [
			"application.commands",
			"data.metadata_query",
			"users.users_query",
			"functions.file_associations",
		],
	},
	ctx => {
		const commands = ctx.get_commands()

		commands.emit("cmd.application.add_translations", {
			lang: "en",
			translations: {
				"t.database.file_association.readable_name": "Database",
				"t.database.file_association.description":
					"This file represents a database where each row is a separate file contained inside the database.",
			},
		})

		commands.emit("cmd.functions.file_associations.add", {
			name: "pink.ordo.database",
			types: [
				{
					name: "database/ordo",
					readable_name: "t.database.file_association.readable_name",
					description: "t.database.file_association.description",
				},
			],
			render: ({ div, metadata, content }) =>
				Maoka.render_dom(div, Database(metadata, content, ctx)),
			render_icon: span => span.replaceChildren(BsFileEarmarkRuled() as any),
		})
	},
)
