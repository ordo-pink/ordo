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

import { type Context } from "koa"

import { RRR, type TRrr } from "@ordo-pink/data"
import { type TUserService, UserService } from "@ordo-pink/backend-service-user"
import { Oath } from "@ordo-pink/oath"
import { type TLogger } from "@ordo-pink/logger"
import { type TTokenService } from "@ordo-pink/backend-service-token"
import { authenticate0 } from "@ordo-pink/backend-utils"
import { from_option0 } from "@ordo-pink/tau"

export const get_by_email0: TFn = (ctx, { user_service, token_service }) =>
	authenticate0(ctx, token_service)
		.pipe(Oath.ops.chain(() => validate_ctx0(ctx.params)))
		.pipe(Oath.ops.chain(get_user_by_email0(user_service)))
		.pipe(Oath.ops.map(body => ({ status: 200, body })))

// --- Internal ---

const LOCATION = "get_public_by_email"

const einval = RRR.codes.einval(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)

type TCtx = Routes.ID.GetUserByEmail.Params
type TParams = { user_service: TUserService; token_service: TTokenService; logger: TLogger }
type TFn = (
	ctx: Context,
	params: TParams,
) => Oath<Routes.ID.GetUserByEmail.Response, TRrr<"EACCES" | "ENOENT" | "EIO" | "EINVAL">>

const validate_ctx0 = ({ email }: TCtx) =>
	Oath.FromNullable(email).pipe(
		Oath.ops.rejected_map(() => einval(`validate_ctx -> email: ${email}`)),
	)

const get_user_by_email0 = (user_service: TUserService) => (email: string) =>
	user_service
		.get_by_email(email)
		.pipe(Oath.ops.chain(from_option0(() => enoent(`get_by_email -> email: ${email}`))))
		.pipe(Oath.ops.map(UserService.serialise_public))
