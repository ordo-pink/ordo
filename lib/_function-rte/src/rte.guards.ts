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

import { is_array, is_finite_non_negative_int, is_non_empty_string, is_object, is_string, is_undefined } from "@ordo-pink/_tau"
import { Metadata } from "@ordo-pink/_core"

import type * as T from "./rte.types"

export const is_rte_node = (x: any): x is T.TRTENode => is_object(x) && is_non_empty_string(x.type)

export const is_rte_parent = (x: any): x is T.TRTEParent => is_rte_node(x) && is_array(x.children)

export const is_rte_text_node = (x: any): x is T.TRTETextNode =>
	is_rte_node(x) && x.type === "text" && is_string(x.value) && is_array(x.styles)

export const is_rte_code_node = (x: any): x is T.TRTECodeNode => is_rte_node(x) && x.type === "code" && is_string(x.value)

export const is_rte_paragraph_node = (x: any): x is T.TRTEParagraphNode => is_rte_parent(x) && x.type === "p"

export const is_rte_blockquote_node = (x: any): x is T.TRTEBlockquoteNode => is_rte_parent(x) && x.type === "bq"

export const is_rte_callout_node = (x: any): x is T.TRTECalloutNode => is_rte_parent(x) && x.type === "callout"

export const is_rte_header_node = (x: any): x is T.TRTEHeaderNode =>
	is_rte_parent(x) && x.type === "h" && [1, 2, 3, 4, 5, 6].includes(x.level as any)

export const is_rte_context_menu_payload = (
	x: Ordo.ContextMenu.Params<any>,
): x is Ordo.ContextMenu.Params<{ location: "rte"; block_index: number }> => {
	if (!x.payload) return false

	return x.payload.location === "rte" && is_finite_non_negative_int(x.payload.block_index)
}

export const is_rte_embed_node = (x: any): x is T.TRTEEmbedNode =>
	is_rte_node(x) && x.type === "embed" && (is_undefined(x.fsid) || Metadata.Validations.is_fsid(x.fsid))
