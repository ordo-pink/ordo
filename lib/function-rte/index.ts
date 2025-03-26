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

import {
	BsBoxArrowInUpLeft,
	BsFileEarmarkRichText,
	BsInfoCircle,
	BsQuote,
	BsType,
	BsTypeH1,
	BsTypeH2,
	BsTypeH3,
	BsTypeH4,
	BsTypeH5,
	BsTypeH6,
} from "@ordo-pink/frontend-icons"
import { ContextMenuItemType, create_function } from "@ordo-pink/core"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStr } from "@ordo-pink/maoka-render-string"
import { TwoLetterLocale } from "@ordo-pink/locale"

import { CalloutType } from "./src/rte.constants"
import { RTE } from "./src/rte"
import { RichText } from "./src/components/rich-text.component"
import { TRTENode } from "./src/rte.types"
import { create_selection } from "./src/rte.utils"

import rte_styles from "./src/rte.css?inline"

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
				turn_to_embed: () => string
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
			add_block: () => { fsid: Ordo.Metadata.FSID; block: TRTENode; block_index: number; preserve_caret_position?: boolean }
			add_block_after_selection: () => { fsid: Ordo.Metadata.FSID; block: TRTENode }
			add_inline: () => { fsid: Ordo.Metadata.FSID; inline: TRTENode; block_index: number; inline_index: number }
			add_inline_after_selection: () => { inline: TRTENode; fsid: Ordo.Metadata.FSID }
			replace_block: () => { fsid: Ordo.Metadata.FSID; block: TRTENode; block_index: number }
			replace_inline: () => { fsid: Ordo.Metadata.FSID; inline: TRTENode; block_index: number; inline_index: number }
			wrap_selection: () => { fsid: Ordo.Metadata.FSID; node: TRTENode }
			remove_block: () => { fsid: Ordo.Metadata.FSID; block_index: number; preserve_caret_position?: boolean }
			remove_inline: () => { fsid: Ordo.Metadata.FSID; block_index: number; inline_index: number }
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
			"cmd.application.context_menu.add",
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
				"t.rte.commands.turn_to_embed": "Turn to Embed",
				"t.rte.callout.default": "Default",
				"t.rte.callout.info": "Info",
				"t.rte.callout.question": "Question",
				"t.rte.callout.rrr": "RRR",
				"t.rte.callout.success": "Success",
				"t.rte.callout.warn": "Warning",
			},
		})

		commands.on("cmd.rte.add_block", params => void handle_add_block(params))
		commands.on("cmd.rte.remove_block", params => void handle_remove_block(params))
		commands.on("cmd.rte.replace_block", params => void handle_replace_block(params))

		// TODO Other blocks

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.rte.replace_block",
			readable_name: "t.rte.commands.turn_to_h1",
			should_show: RTE.Guards.is_rte_context_menu_payload,
			render_icon: BsTypeH1,
			type: ContextMenuItemType.UPDATE,
			payload_creator: ({ payload }) => ({
				fsid: payload.fsid,
				block_index: payload.block_index,
				block: { type: "h", level: 1 },
			}),
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.rte.replace_block",
			readable_name: "t.rte.commands.turn_to_h2",
			should_show: RTE.Guards.is_rte_context_menu_payload,
			render_icon: BsTypeH2,
			type: ContextMenuItemType.UPDATE,
			payload_creator: ({ payload }) => ({
				fsid: payload.fsid,
				block_index: payload.block_index,
				block: { type: "h", level: 2 },
			}),
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.rte.replace_block",
			readable_name: "t.rte.commands.turn_to_h3",
			should_show: RTE.Guards.is_rte_context_menu_payload,
			render_icon: BsTypeH3,
			type: ContextMenuItemType.UPDATE,
			payload_creator: ({ payload }) => ({
				fsid: payload.fsid,
				block_index: payload.block_index,
				block: { type: "h", level: 3 },
			}),
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.rte.replace_block",
			readable_name: "t.rte.commands.turn_to_h4",
			should_show: RTE.Guards.is_rte_context_menu_payload,
			render_icon: BsTypeH4,
			type: ContextMenuItemType.UPDATE,
			payload_creator: ({ payload }) => ({
				fsid: payload.fsid,
				block_index: payload.block_index,
				block: { type: "h", level: 4 },
			}),
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.rte.replace_block",
			readable_name: "t.rte.commands.turn_to_h5",
			should_show: RTE.Guards.is_rte_context_menu_payload,
			render_icon: BsTypeH5,
			type: ContextMenuItemType.UPDATE,
			payload_creator: ({ payload }) => ({
				fsid: payload.fsid,
				block_index: payload.block_index,
				block: { type: "h", level: 5 },
			}),
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.rte.replace_block",
			readable_name: "t.rte.commands.turn_to_h6",
			should_show: RTE.Guards.is_rte_context_menu_payload,
			render_icon: BsTypeH6,
			type: ContextMenuItemType.UPDATE,
			payload_creator: ({ payload }) => ({
				fsid: payload.fsid,
				block_index: payload.block_index,
				block: { type: "h", level: 6 },
			}),
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.rte.replace_block",
			readable_name: "t.rte.commands.turn_to_blockquote",
			should_show: RTE.Guards.is_rte_context_menu_payload,
			render_icon: BsQuote,
			type: ContextMenuItemType.UPDATE,
			payload_creator: ({ payload }) => ({ fsid: payload.fsid, block_index: payload.block_index, block: { type: "bq" } }),
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.rte.replace_block",
			readable_name: "t.rte.commands.turn_to_paragraph",
			should_show: RTE.Guards.is_rte_context_menu_payload,
			render_icon: BsType,
			type: ContextMenuItemType.UPDATE,
			payload_creator: ({ payload }) => ({ fsid: payload.fsid, block_index: payload.block_index, block: { type: "p" } }),
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.rte.replace_block",
			readable_name: "t.rte.commands.turn_to_incoming_links",
			should_show: RTE.Guards.is_rte_context_menu_payload,
			render_icon: BsBoxArrowInUpLeft,
			type: ContextMenuItemType.UPDATE,
			payload_creator: ({ payload }) => ({
				fsid: payload.fsid,
				block_index: payload.block_index,
				block: { type: "incoming_links" },
			}),
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.rte.replace_block",
			readable_name: "t.rte.commands.turn_to_callout",
			should_show: RTE.Guards.is_rte_context_menu_payload,
			render_icon: BsInfoCircle,
			type: ContextMenuItemType.UPDATE,
			payload_creator: ({ payload }) => ({
				fsid: payload.fsid,
				block_index: payload.block_index,
				block: { type: "callout", callout_type: CalloutType.DEFAULT },
			}),
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.rte.replace_block",
			readable_name: "t.rte.commands.turn_to_embed",
			should_show: RTE.Guards.is_rte_context_menu_payload,
			render_icon: BsBoxArrowInUpLeft,
			type: ContextMenuItemType.UPDATE,
			payload_creator: ({ payload }) => ({ fsid: payload.fsid, block_index: payload.block_index, block: { type: "embed" } }),
		})

		commands.emit("cmd.functions.file_associations.register", {
			content_to_string: {
				styles: [rte_styles],
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

const handle_add_block: Ordo.Command.HandlerOf<"cmd.rte.add_block"> = ({ fsid, block, block_index }) => {
	RTE.$.update(`state.${fsid}`, state => {
		if (!state) return state

		const state_copy = { ...state }

		state_copy.content = state.content.slice(0, block_index).concat(block).concat(state.content.slice(block_index))

		return state_copy
	})

	RTE.$.update(`state.${fsid}`, state => {
		if (!state) return state

		const state_copy = { ...state }

		state_copy.selection = { anchor: 0, block: block_index, focus: 0, inline: 0 }

		return state_copy
	})
}

const handle_replace_block: Ordo.Command.HandlerOf<"cmd.rte.replace_block"> = ({ fsid, block, block_index }) => {
	RTE.$.update(`state.${fsid}`, state => {
		if (!state || !state.content[block_index]) return state

		const state_copy = { ...state }

		state_copy.content[block_index] = { ...state_copy.content[block_index], ...block }

		return state_copy
	})
}

const handle_remove_block: Ordo.Command.HandlerOf<"cmd.rte.remove_block"> = ({
	fsid,
	block_index,
	preserve_caret_position,
}) => {
	RTE.$.update(`state.${fsid}`, state => {
		if (!state) return state

		const state_copy = { ...state }

		state_copy.content = state.content.toSpliced(block_index, 1)

		const prev_block = state_copy.content[block_index - 1]

		if (block_index > 0 && prev_block) {
			if (RTE.Guards.is_rte_parent(prev_block)) {
				const last_index = prev_block.children.length - 1
				const last_inline = prev_block.children[last_index]

				if (RTE.Guards.is_rte_text_node(last_inline)) {
					const offset = last_inline.value.length
					if (!preserve_caret_position)
						state_copy.selection = { anchor: offset, focus: offset, block: block_index - 1, inline: last_index }
				}
			} else {
				if (!preserve_caret_position) state_copy.selection = create_selection()
			}
		}

		return state_copy
	})
}
