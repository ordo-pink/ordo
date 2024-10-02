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

import { Context } from "koa"

import { RRR, type TRrr } from "@ordo-pink/managers"
import { type TUserService, UserService } from "@ordo-pink/backend-service-user"
import { Oath } from "@ordo-pink/oath"
import { type TLogger } from "@ordo-pink/logger"
import { type TTokenService } from "@ordo-pink/backend-service-token"
import { authenticate0 } from "@ordo-pink/backend-utils"
import { from_option0 } from "@ordo-pink/tau"

export const get_account0: TFn = (ctx, { token_service, user_service }) =>
	authenticate0(ctx, token_service)
		.pipe(Oath.ops.map(token => token.payload.sub))
		.pipe(Oath.ops.chain(get_user_by_id0(user_service)))
		.pipe(Oath.ops.map(body => ({ status: 200, body })))

// --- Internal ---

const LOCATION = "get_account"

const enoent = RRR.codes.enoent(LOCATION)

type TParams = { token_service: TTokenService; user_service: TUserService; logger: TLogger }
type TFn = (
	ctx: Context,
	params: TParams,
) => Oath<Routes.ID.GetAccount.Response, TRrr<"EIO" | "ENOENT" | "EINVAL" | "EACCES">>

const get_user_by_id0 = (user_service: TUserService) => (sub: string) =>
	user_service
		.get_by_id(sub)
		.pipe(Oath.ops.chain(from_option0(() => enoent(`get_user_by_id -> id: ${sub}`))))
		.pipe(Oath.ops.map(UserService.serialise))
