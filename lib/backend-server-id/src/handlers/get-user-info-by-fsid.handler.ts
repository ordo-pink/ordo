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

import {
	type Oath,
	bimap0,
	chain0,
	fromBoolean0,
	fromNullable0,
	rejectedMap0,
} from "@ordo-pink/oath"
import { type UUIDv4, isUUID } from "@ordo-pink/tau"
import { authenticate0, sendError, sendSuccess } from "@ordo-pink/backend-utils"
import { type HttpError } from "@ordo-pink/rrr"
import { type TTokenService } from "@ordo-pink/backend-service-token"
import { type UserService } from "@ordo-pink/backend-service-user"

import { toInvalidRequestError, toUserNotFoundError } from "../fns/to-error"

export const handleUserInfoByID: TFn =
	({ tokenService, userService }) =>
	ctx =>
		authenticate0(ctx, tokenService)
			.and(() => ctx.params)
			.and(validateParams0)
			.and(getUserByID0(userService))
			.fork(sendError(ctx), sendSuccess({ ctx }))

// --- Internal ---

type TParams = { tokenService: TTokenService; userService: UserService }
type TFn = (params: TParams) => Middleware
type TResult = Routes.ID.GetUserInfoByID.Result

type TValidateParamsFn = (p: Routes.ID.GetUserInfoByID.RequestParams) => Oath<UUIDv4, HttpError>
const validateParams0: TValidateParamsFn = ({ id }) =>
	fromNullable0(id)
		.pipe(chain0(id => fromBoolean0(isUUID(id), id as UUIDv4)))
		.pipe(rejectedMap0(toInvalidRequestError))

type TGetUserByIDFn = (us: UserService) => (id: string) => Oath<TResult, HttpError>
const getUserByID0: TGetUserByIDFn = userService => id =>
	userService.getById(id).pipe(bimap0(toUserNotFoundError, userService.serializePublic))
