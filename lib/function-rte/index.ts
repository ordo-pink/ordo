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
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStr } from "@ordo-pink/maoka-render-string"
import { TwoLetterLocale } from "@ordo-pink/locale"
import { create_function } from "@ordo-pink/core"

import { RichText } from "./src/components/rich-text.component"
import { TRTENode } from "./src/rte.types"

declare global {
	interface t {
		rte: {
			file_association: {
				readable_name: () => string
				description: () => string
			}
			commands: {
				turn_to_h1: () => string
				turn_to_h2: () => string
				turn_to_h3: () => string
				turn_to_h4: () => string
				turn_to_h5: () => string
				turn_to_h6: () => string
				turn_to_paragraph: () => string
				turn_to_blockquote: () => string
				turn_to_incoming_links: () => string
				turn_to_callout: () => string
			}
			callout: {
				rrr: () => string
				question: () => string
				info: () => string
				success: () => string
				default: () => string
				warn: () => string
			}
		}
	}

	interface cmd {
		rte: {
			add_block: () => { block: TRTENode; block_index: number }
			add_block_after_selection: () => { block: TRTENode }
			add_inline: () => { inline: TRTENode; block_index: number; inline_index: number }
			add_inline_after_selection: () => TRTENode
			replace_block: () => { block: TRTENode; block_index: number }
			replace_inline: () => { inline: TRTENode; block_index: number; inline_index: number }
			wrap_selection: () => TRTENode
			remove_block: () => number
			remove_inline: () => { block_index: number; inline_index: number }
			show_quick_menu: () => void
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
				"t.rte.file_association.readable_name": "Rich Text",
				"t.rte.file_association.description":
					"This is a rich text file that allows custom user input and embedding other files in read-only mode.",
				"t.rte.commands.turn_to_h1": "Turn to Header 1",
				"t.rte.commands.turn_to_h2": "Turn to Header 2",
				"t.rte.commands.turn_to_h3": "Turn to Header 3",
				"t.rte.commands.turn_to_h4": "Turn to Header 4",
				"t.rte.commands.turn_to_h5": "Turn to Header 5",
				"t.rte.commands.turn_to_h6": "Turn to Header 6",
				"t.rte.commands.turn_to_blockquote": "Turn to Blockquote",
				"t.rte.commands.turn_to_paragraph": "Turn to Paragraph",
				"t.rte.commands.turn_to_incoming_links": "Turn to Incoming Links",
				"t.rte.commands.turn_to_callout": "Turn to Callout",
				"t.rte.callout.default": "Default",
				"t.rte.callout.info": "Info",
				"t.rte.callout.question": "Question",
				"t.rte.callout.rrr": "RRR",
				"t.rte.callout.success": "Success",
				"t.rte.callout.warn": "Warning",
			},
		})

		commands.emit("cmd.functions.file_associations.register", {
			content_to_string: {
				render: ({ metadata, content, is_editable, is_embedded }) =>
					MaokaStr.render(
						MaokaOrdo.Components.WithState(ctx, () => RichText(metadata, content, is_editable, is_embedded)),
						() => crypto.randomUUID(),
					),
			},
			name: "pink.ordo.rich-text",
			render_icon: BsFileEarmarkRichText,
			render: ({ metadata, content, is_editable, is_embedded }) => RichText(metadata, content, is_editable, is_embedded),
			types: [
				{
					name: "text/ordo",
					readable_name: "t.rte.file_association.readable_name",
					description: "t.rte.file_association.description",
				},
			],
		})
	},
)
