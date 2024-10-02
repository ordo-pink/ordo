// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import type { Context } from "koa"

import { type TUserService, UserService } from "@ordo-pink/backend-service-user"
import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { from_option0 } from "@ordo-pink/tau"
import { parse_body0 } from "@ordo-pink/backend-utils"

export const confirm_email0: TFn = (ctx, { user_service }) =>
	parse_body0<Ordo.Routes.ID.ConfirmEmail.RequestBody>(ctx, "object")
		.pipe(Oath.ops.chain(extract_ctx0(user_service)))
		.pipe(Oath.ops.chain(update_user0(user_service)))
		.pipe(Oath.ops.map(UserService.serialise))
		.pipe(Oath.ops.map(body => ({ status: 200, body })))

// --- Internal ---

type TParams = { user_service: TUserService }
type TFn = (
	ctx: Context,
	params: TParams,
) => Oath<Ordo.Routes.ID.ConfirmEmail.Response, Ordo.Rrr<"EINVAL" | "EIO" | "ENOENT">>
type TCtx = { user: User.InternalUser; code: string }

const LOCATION = "confirm_email"

const einval = RRR.codes.einval(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)

const extract_ctx0 =
	(user_service: TUserService) =>
	({ email, code }: Ordo.Routes.ID.ConfirmEmail.RequestBody) =>
		Oath.Merge({
			code: Oath.FromNullable(code, () => einval(`extract_ctx -> code: ${code}`)),
			user: Oath.FromNullable(email)
				.pipe(Oath.ops.rejected_map(() => einval(`extract_ctx -> email: ${email}`)))
				.pipe(
					Oath.ops.chain(email =>
						user_service
							.get_by_email(email)
							.pipe(Oath.ops.chain(from_option0(() => enoent(`extract_ctx -> email: ${email}`)))),
					),
				),
		})

const update_user0 = (user_service: TUserService) => (ctx: TCtx) =>
	user_service.confirm_email(ctx.user.id).pipe(Oath.ops.map(() => ctx.user))
