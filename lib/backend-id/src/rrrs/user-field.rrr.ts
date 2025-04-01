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

import { RRR } from "@ordo-pink/core"
import { Routary } from "@ordo-pink/routary"

import { type TIDContext } from "../backend-id.types"

export const invalid_installed_functions_rrr = (installed_functions: unknown, intake: Routary.Intake<TIDContext>) => ({
	rrr: RRR.codes.einval("invalid installed functions", installed_functions),
	intake,
})

export const invalid_first_name_rrr = (first_name: unknown, intake: Routary.Intake<TIDContext>) => ({
	rrr: RRR.codes.einval("invalid first name", first_name),
	intake,
})

export const invalid_last_name_rrr = (last_name: unknown, intake: Routary.Intake<TIDContext>) => ({
	rrr: RRR.codes.einval("invalid last name", last_name),
	intake,
})
