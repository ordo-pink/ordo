/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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
import { sweech } from "@ordo-pink/sweech"

import { type TBlockNodeParams, type TRTEHeaderNode } from "../../rte.types"
import { Inline } from "../inline.component"

export const Header = ({ block_index, metadata, node, is_editable, is_embedded }: TBlockNodeParams<TRTEHeaderNode>) =>
	sweech
		.match(node.level)
		.case(1, () =>
			StyledH1(
				() => () =>
					node.children.map((node, inline_index) =>
						Inline({ node, block_index, inline_index, metadata, is_editable, is_embedded }),
					),
			),
		)
		.case(2, () =>
			StyledH2(
				() => () =>
					node.children.map((node, inline_index) =>
						Inline({ node, block_index, inline_index, metadata, is_editable, is_embedded }),
					),
			),
		)
		.case(3, () =>
			StyledH3(
				() => () =>
					node.children.map((node, inline_index) =>
						Inline({ node, block_index, inline_index, metadata, is_editable, is_embedded }),
					),
			),
		)
		.case(4, () =>
			StyledH4(
				() => () =>
					node.children.map((node, inline_index) =>
						Inline({ node, block_index, inline_index, metadata, is_editable, is_embedded }),
					),
			),
		)
		.case(5, () =>
			StyledH5(
				() => () =>
					node.children.map((node, inline_index) =>
						Inline({ node, block_index, inline_index, metadata, is_editable, is_embedded }),
					),
			),
		)
		.case(6, () =>
			StyledH6(
				() => () =>
					node.children.map((node, inline_index) =>
						Inline({ node, block_index, inline_index, metadata, is_editable, is_embedded }),
					),
			),
		)
		.default(() => "INVALID HEADER")

// --- Internal ---

const StyledH1 = MaokaStyled.Tags.h1("cursor-text w-full text-3xl font-black px-1")
const StyledH2 = MaokaStyled.Tags.h2("cursor-text w-full text-2xl font-extrabold px-1")
const StyledH3 = MaokaStyled.Tags.h3("cursor-text w-full text-xl font-bold px-1")
const StyledH4 = MaokaStyled.Tags.h4("cursor-text w-full text-xl px-1")
const StyledH5 = MaokaStyled.Tags.h5("cursor-text w-full text-lg font-bold px-1")
const StyledH6 = MaokaStyled.Tags.h6("cursor-text w-full text-lg px-1")
