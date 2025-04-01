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

export const invalid_email_rrr = (email: unknown, intake: Routary.Intake<TIDContext>) => ({
	rrr: RRR.codes.einval("invalid email", email),
	intake,
})

export const email_missing_rrr = (intake: Routary.Intake<TIDContext>) => ({
	rrr: RRR.codes.einval("email not provided"),
	intake,
})

export const exists_by_email_rrr = (email: string, intake: Routary.Intake<TIDContext>) => ({
	rrr: RRR.codes.eexist("user already exists", email),
	intake,
})
