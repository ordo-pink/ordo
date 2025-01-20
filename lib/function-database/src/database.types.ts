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

import { ColumnType, SortingDirection } from "./database.constants"

export type TDatabaseState = {
	sorting?: Partial<Record<TColumnName, SortingDirection>>
	visible_columns?: TColumnName[]
	columns?: TColumn<any>[]
}

export type TColumnName = string

export type TColumn<$TParams = void> = {
	name: TColumnName
	type: ColumnType
	params: $TParams
	sort?: (a: Ordo.Metadata.Instance, b: Ordo.Metadata.Instance) => -1 | 0 | 1
	render_icon?: (div: HTMLDivElement) => void | Promise<void>
	render_cell: (div: HTMLDivElement, metadata: Ordo.Metadata.Instance, params: $TParams) => void | Promise<void>
}
