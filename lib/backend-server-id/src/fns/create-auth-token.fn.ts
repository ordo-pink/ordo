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

import { type JTI } from "@ordo-pink/wjwt"
import { Oath } from "@ordo-pink/oath"
import { type TRrr } from "@ordo-pink/managers"
import { type TTokenService } from "@ordo-pink/backend-service-token"

export type TCreateAuthTokenResult = {
	user: User.InternalUser
	expires: Date
	jti: JTI
	token: string
}

export const create_auth_token0 =
	(token_service: TTokenService) =>
	(user: User.InternalUser): Oath<TCreateAuthTokenResult, TRrr<"EIO" | "EINVAL">> =>
		token_service
			.create({
				sub: user.id,
				data: {
					lim: user.file_limit,
					mfs: user.max_upload_size,
					sbs: user.subscription,
					mxf: user.max_functions,
				},
			})
			.pipe(
				Oath.ops.chain(({ exp, jti, token }) =>
					Oath.Resolve(new Date(Date.now() + exp)).pipe(Oath.ops.map(expires => ({ user, expires, jti, token }))),
				),
			)
