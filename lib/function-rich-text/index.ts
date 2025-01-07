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

import { BsFileEarmarkRichText } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { TwoLetterLocale } from "@ordo-pink/locale"
import { create_function } from "@ordo-pink/core"

import { RichText } from "./src/rich-text.component"

declare global {
	interface t {
		text: {
			file_association: {
				readable_name: () => string
				description: () => string
			}
		}
	}
}

export default create_function(
	"pink.ordo.rich-text",
	{
		commands: [
			"cmd.application.add_translations",
			"cmd.metadata.show_create_modal",
			"cmd.application.router.navigate",
			"cmd.application.command_palette.show",
			"cmd.functions.file_associations.register",
			"cmd.metadata.rename",
			"cmd.content.set",
		],
		queries: [],
	},
	ctx => {
		const commands = ctx.commands

		commands.emit("cmd.application.add_translations", {
			lang: TwoLetterLocale.ENGLISH,
			translations: {
				"t.text.file_association.readable_name": "Rich Text",
				"t.text.file_association.description":
					"This is a rich text file that allows custom user input and embedding other files in read-only mode.",
			},
		})

		// TODO Move to text editor
		commands.emit("cmd.functions.file_associations.register", {
			name: "pink.ordo.rich-text",
			types: [
				{
					name: "text/ordo",
					readable_name: "t.text.file_association.readable_name",
					description: "t.text.file_association.description",
				},
			],
			render: ({ div, metadata, content }) =>
				// TODO Replace with text editor
				Maoka.render_dom(
					div,
					MaokaOrdo.Components.WithState(ctx, () => RichText(metadata, content!)),
				),
			render_icon: span => {
				span.appendChild(BsFileEarmarkRichText() as any)
				return Promise.resolve()
			},
		})
	},
)
