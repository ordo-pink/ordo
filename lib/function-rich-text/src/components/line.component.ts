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

import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { Switch } from "@ordo-pink/switch"

import { Inline } from "./inline.component"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { RTE } from ".."
import { type TOrdoRTEParagraphNode } from "../../rich-text.types"

// --- Internal ---

const StyledTextBlock = MaokaStyled.Tags.div("cursor-text w-full px-1 my-2")
const StyledLine = MaokaStyled.Tags.div()

export const Line = (block_index: number) =>
	StyledLine(({ use }) => {
		const get_node = use(MaokaOrdo.Jabs.happy_marriage$(RTE.$, ({ content }) => content[block_index]))

		return () => {
			const node = get_node()

			if (!node) return

			return Switch.Match(node.type)
				.case("embed", () => "HEY")
				.case("p", () => TextBlock(node as TOrdoRTEParagraphNode, block_index))
				.default(() => "")
		}
	})

const TextBlock = (node: TOrdoRTEParagraphNode, index: number) =>
	StyledTextBlock(() => {
		return () => node.children.map((child, inline_index) => Inline(child, index, inline_index))
	})
