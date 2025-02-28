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
import { BackendUserKeys } from "@ordo-pink/backend"
import { type TIntake } from "@ordo-pink/routary"
import { unknown_error } from "@ordo-pink/backend-util-extract-body"

import { type TIDContext } from "../backend-id.types"

export const create_auth_token = (intake: TIntake<TIDContext>) => (user: OrdoBackend.User.DTO) =>
	Oath.FromPromise(() =>
		intake.wjwt.sign({
			sub: user[BackendUserKeys.UID],
			lim: user[BackendUserKeys.FILE_LIMIT],
			mus: user[BackendUserKeys.MAX_UPLOAD_SIZE],
			sbs: user[BackendUserKeys.SUBSCRIPTION],
			mlf: user[BackendUserKeys.MAX_FUNCTIONS],
		}),
	)
		.pipe(ops0.map(jwt => ({ jwt, user })))
		.pipe(ops0.rejected_map(rrr => unknown_error(rrr, intake)))
