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

import { Oath, ops0 } from "@ordo-pink/oath"
import { CurrentUser } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { email_missing_rrr, invalid_email_rrr } from "../rrrs/invalid-user-email.rrr"
import { type TIDContext } from "../backend-id.types"

export const extract_body_email = (intake: TIntake<TIDContext>) => (request_body: any) =>
	Oath.FromNullable(request_body.email)
		.pipe(ops0.rejected_map(() => email_missing_rrr(intake)))
		.pipe(
			ops0.chain(email =>
				Oath.If(is_email(email), { T: () => email as Ordo.User.Email, F: () => invalid_email_rrr(email, intake) }),
			),
		)

// --- Internal ---

const is_email = CurrentUser.Validations.is_email
