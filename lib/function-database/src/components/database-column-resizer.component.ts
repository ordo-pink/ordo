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

import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"

import { database$ } from "../database.state"

const StyledColumnResizer = MaokaStyled.Tags.div("database_table-head_cell-resizer")

export const ColumnResizer = (column: string) =>
	StyledColumnResizer(({ use }) => {
		const handle_mount = () => {
			let current_column: HTMLElement | null
			let page_x: number | null
			let current_column_width: number | null
			let new_width: number | null

			const handle_mouse_down = (event: MouseEvent) => {
				event.stopPropagation()

				const target = event.target as HTMLElement
				current_column = target.parentElement
				page_x = event.pageX
				current_column_width = current_column?.offsetWidth ?? null
			}

			const handle_mouse_move = (event: MouseEvent) => {
				if (current_column) {
					const diff_x = event.pageX - (page_x ?? 0)

					if (current_column_width) {
						new_width = current_column_width + diff_x
						current_column.style.width = `${new_width}px`
					}
				}
			}

			const handle_mouse_up = (event: MouseEvent) => {
				event.stopPropagation()

				database$.update("width", state_width => {
					if (!new_width) return state_width
					if (!state_width) state_width = {}

					const width_copy = { ...state_width }

					width_copy[column] = new_width

					return width_copy
				})

				current_column = null
				page_x = null
				current_column_width = null
				new_width = null
			}

			const handle_click = (event: MouseEvent) => event.stopPropagation()

			use(maoka_jabs.listen("onmousedown", handle_mouse_down))
			use(maoka_jabs.listen("onclick", handle_click))

			document.addEventListener("mousemove", handle_mouse_move)
			document.addEventListener("mouseup", handle_mouse_up)

			return () => {
				document.removeEventListener("mousemove", handle_mouse_move)
				document.removeEventListener("mouseup", handle_mouse_up)
			}
		}

		use(MaokaDOM.Jabs.onmount(handle_mount))
	})
