// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { type Middleware } from "koa"
import { type Readable } from "stream"

import { type FSID, type TDataCommands } from "@ordo-pink/data"
import { authenticate0, sendError } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import { type SUB } from "@ordo-pink/wjwt"
import { type Unary } from "@ordo-pink/tau"

export const handleSetContent: Unary<
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
			.chain(({ sub }) =>
				Oath.of({ fsid: ctx.params.fsid as FSID, createdBy: ctx.params.userId as SUB }).chain(
					({ fsid, createdBy }) =>
						dataService
							.updateContent({
								fsid,
								createdBy,
								updatedBy: sub,
								content: ctx.request.req,
								length: Number(ctx.req.headers["content-length"]),
							})
							.rejectedMap(HttpError.NotFound),
				),
			)
			.fork(sendError(ctx), result => {
				ctx.response.status = 200
				ctx.response.body = { success: true, result }
			})
