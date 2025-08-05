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
import { MetadataLink } from "@ordo-pink/maoka-components"

import { type TBlockNodeParams, type TRTEIncomingLinksNode } from "../../rte.types"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const IncomingLinks = ({ metadata }: TBlockNodeParams<TRTEIncomingLinksNode>) =>
	StyledIncomingLinks(({ use }) => {
		const get_incoming_links = use(MaokaOrdo.Jabs.Metadata.get_incoming_links$(metadata.get_fsid()))

		return () => [
			StyledTitle(() => () => "Incoming links"),
			StyledList(
				() => () =>
					get_incoming_links().map(metadata =>
						StyledItem(() => () => MetadataLink({ metadata, children: metadata.get_name() })),
					),
			),
		]
	})

// --- Internal ---

const StyledIncomingLinks = MaokaStyled.Tags.div("rte_blocks_incoming-links")
const StyledTitle = MaokaStyled.Tags.div("rte_blocks_incoming-links_title")
const StyledList = MaokaStyled.Tags.ul("rte_blocks_incoming-links_list")
const StyledItem = MaokaStyled.Tags.li("rte_blocks_incoming-links_list_item")
