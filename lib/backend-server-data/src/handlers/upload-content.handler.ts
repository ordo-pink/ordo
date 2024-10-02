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
import { type Readable } from "stream"

import { type FSID, type TDataCommands } from "@ordo-pink/managers"
import { authenticate0, send_error } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import { type SUB } from "@ordo-pink/wjwt"
import { type Unary } from "@ordo-pink/tau"

export const handleUploadContent: Unary<
	{ dataService: TDataCommands<Readable>; idHost: string },
	Middleware
> =
	({ dataService, idHost }) =>
	ctx =>
		authenticate0(ctx, idHost)
			.chain(({ payload }) =>
				Oath.fromNullable(ctx.req.headers["content-length"]).bimap(
					() => HttpError.UnprocessableEntity("Unknown size"),
					() => payload,
				),
			)
			.chain(
				Oath.ifElse(
					payload => Number(ctx.req.headers["content-length"]) / 1024 / 1024 <= payload.fms,
					{ onFalse: () => HttpError.PayloadTooLarge("File too large") },
				),
			)
			.chain(({ sub, lim }) =>
				Oath.of({ name: ctx.params.name as string, createdBy: ctx.params.userId as SUB }).chain(
					({ name, createdBy }) =>
						Oath.of((ctx.get("ordo-parent") as FSID) || null).chain(parent =>
							dataService
								.uploadContent({
									name,
									parent,
									createdBy,
									updatedBy: sub,
									content: ctx.request.req,
									fileLimit: lim,
									length: Number(ctx.req.headers["content-length"]),
								})
								.rejectedMap(HttpError.NotFound),
						),
				),
			)
			.fork(send_error(ctx), () => {
				ctx.response.status = 200
				ctx.response.body = { success: true, result: ctx.req.headers["content-length"] }
			})
