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

import { Input } from "@ordo-pink/maoka-components"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { noop } from "@ordo-pink/tau"

import { TBlockNodeParams, type TRTEBlockquoteNode } from "../../rte.types"
import { Inline } from "../inline.component"
import { RTE } from "../../rte"

export const Blockquote = ({ block_index, metadata, node, is_editable, is_embedded }: TBlockNodeParams<TRTEBlockquoteNode>) =>
	StyledBlockquote(({ use }) => {
		const fsid = metadata.get_fsid()
		if (node.cite) use(MaokaJabs.set_attribute("cite", node.cite))

		let value = node.cite

		return () => [
			...node.children.map((node, inline_index) =>
				Inline({ node, block_index, inline_index, metadata, is_editable, is_embedded }),
			),
			InputOffset(() => noop),
			Input.Text({
				initial_value: value,
				on_input: event => {
					value = (event.target as HTMLInputElement).value
				},
				on_blur: () => {
					RTE.$.update(`state.${fsid}`, state => {
						if (RTE.Guards.is_rte_blockquote_node(state.content[block_index])) {
							const state_copy = { ...state }
							state_copy.content[block_index].cite = value
							return state_copy
						}

						return state
					})
				},
				disabled: !is_editable,
				placeholder: "Enter cite source",
				custom_class: "rte_blocks_blockquote_cite",
				transparent: true,
			}),
		]
	})

// --- Internal ---

const StyledBlockquote = MaokaStyled.Tags.blockquote("rte_blocks_blockquote")

const InputOffset = MaokaStyled.Tags.div()
