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

import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"

import { RTE } from "../rte"

export const QuickMenu = () =>
	StyledQuickMenu(({ use }) => {
		const get_quick_menu = use(
			MaokaOrdo.Jabs.happy_marriage$(RTE.$, state => {
				return state.quick_menu
			}),
		)

		return () => {
			const qm = get_quick_menu()

			if (qm) {
				use(MaokaJabs.add_class("active"))
				use(MaokaJabs.set_style({ left: `${qm.x}px`, top: `${qm.y}px` }))

				return "Here will be a quick menu when it's ready. Refresh the page to make it go away." // TODO
			} else {
				use(MaokaJabs.remove_class("active"))
			}
		}
	})

// --- Internal ---

const StyledQuickMenu = MaokaStyled.Tags.div("rte_quick-menu")
