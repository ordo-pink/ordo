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

import { type Middleware } from "koa"

import { type JWAT, type TTokenService } from "@ordo-pink/backend-service-token"
import { type Oath, bimap0 } from "@ordo-pink/oath"
import { authenticate0, sendError, sendSuccess } from "@ordo-pink/backend-utils"
import { type HttpError } from "@ordo-pink/rrr"
import { type UserService } from "@ordo-pink/backend-service-user"
import { omit } from "@ordo-pink/tau"

import { toUserNotFoundError } from "../fns/to-error"

export const handleAccount: TFn =
	({ tokenService, userService }) =>
	ctx =>
		authenticate0(ctx, tokenService)
			.and(getUserById0(userService))
			.fork(sendError(ctx), sendSuccess({ ctx }))

// --- Internal ---

type TParams = { tokenService: TTokenService; userService: UserService }
type TFn = (params: TParams) => Middleware
type TResult = Routes.ID.GetAccount.Result

type TGetUserByIdFn = (us: UserService) => (token: JWAT) => Oath<TResult, HttpError>
const getUserById0: TGetUserByIdFn = userService => token =>
	userService.getById(token.payload.sub).pipe(bimap0(toUserNotFoundError, omit("code")))
