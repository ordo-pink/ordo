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

import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"

import { type TRTEBlockquoteNode, type TRTEHeaderNode, type TRTEIncomingLinksNode, type TRTEParagraphNode } from "../rte.types"
import { Blockquote } from "./blocks/blockquote.component"
import { Header } from "./blocks/header.component"
import { IncomingLinks } from "./blocks/incoming-links.component"
import { LineNumber } from "./line-number.component"
import { Paragraph } from "./blocks/paragraph.component"
import { RTE } from "../rte"

export const Block = (block_index: number, metadata: Ordo.Metadata.Instance) =>
	StyledLine(({ use }) => {
		const get_node = use(MaokaOrdo.Jabs.happy_marriage$(RTE.$, ({ content }) => content[block_index]))

		use(MaokaJabs.listen("onmouseover", () => handle_mouse_over()))
		use(MaokaJabs.listen("onmouseleave", () => handle_mouse_leave()))
		use(MaokaJabs.listen("onclick", () => handle_click()))
		use(MaokaDOM.Jabs.onmount(() => handle_mount()))

		const line_number = LineNumber(block_index)

		const handle_mouse_over = () =>
			R.If(MaokaDOM.is_maoka_dom_element(line_number.element), { T: () => line_number.element as HTMLElement })
				.pipe(R.ops.chain(element => R.If(RTE.$.select("selection.block") !== block_index, { T: () => element })))
				.cata(R.catas.if_ok(element => element.classList.replace("opacity-0", "opacity-100")))

		const handle_mouse_leave = () =>
			R.If(MaokaDOM.is_maoka_dom_element(line_number.element), { T: () => line_number.element as HTMLElement })
				.pipe(R.ops.chain(element => R.If(RTE.$.select("selection.block") !== block_index, { T: () => element })))
				.cata(R.catas.if_ok(element => element.classList.replace("opacity-100", "opacity-0")))

		const handle_mount = () =>
			RTE.$.cheat("selection.block", block =>
				R.If(MaokaDOM.is_maoka_dom_element(line_number.element), { T: () => line_number.element as HTMLElement }).cata(
					R.catas.if_ok(element => {
						if (block === block_index) element.classList.replace("opacity-0", "opacity-100")
						else element.classList.replace("opacity-100", "opacity-0")
					}),
				),
			)

		const handle_click = () => {
			const content = RTE.$.select("content")

			if (!RTE.Guards.is_rte_parent(content[block_index])) return

			const last_inline_index = content[block_index].children.length - 1

			if (!RTE.Guards.is_rte_text_node(content[block_index].children[last_inline_index])) return

			const last_inline_length = content[block_index].children[last_inline_index].value.length

			RTE.$.update("selection", () => ({
				anchor: last_inline_length,
				block: block_index,
				focus: last_inline_length,
				inline: last_inline_index,
			}))
		}

		return () => {
			const node = get_node()

			// Why should there be no node tho?
			if (!node) return

			return [
				line_number,
				Switch.Match(node.type)
					.case("h", () => Header(node as TRTEHeaderNode, block_index))
					.case("p", () => Paragraph(node as TRTEParagraphNode, block_index))
					.case("bq", () => Blockquote(node as TRTEBlockquoteNode, block_index))
					.case("incoming_links", () => IncomingLinks(node as TRTEIncomingLinksNode, metadata))
					.default(() => ""),
			]
		}
	})

// --- Internal ---

const StyledLine = MaokaStyled.Tags.div("flex items-center px-4 md:px-12 my-3")
