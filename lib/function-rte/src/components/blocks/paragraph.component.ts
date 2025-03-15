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

import { type TBlockNodeParams, type TRTEParagraphNode } from "../../rte.types"
import { Inline } from "../inline.component"

export const Paragraph = ({ block_index, metadata, node }: TBlockNodeParams<TRTEParagraphNode>) =>
	StyledParagraph(() => {
		return () => node.children.map((node, inline_index) => Inline({ node, block_index, inline_index, metadata }))
	})

// --- Internal ---

const StyledParagraph = MaokaStyled.Tags.div("cursor-text w-full px-1 break-words")
