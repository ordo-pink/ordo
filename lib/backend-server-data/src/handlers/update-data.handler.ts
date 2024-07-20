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

import { type FSID, type PlainData, type TDataCommands } from "@ordo-pink/data"
import { authenticate0, parse_body0, send_error } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import { type SUB } from "@ordo-pink/wjwt"
import { type Unary } from "@ordo-pink/tau"

export const handleUpdateData: Unary<
	{ dataService: TDataCommands<Readable>; idHost: string },
	Middleware
> =
	({ dataService, idHost }) =>
	ctx =>
		authenticate0(ctx, idHost)
			.map(({ payload }) => payload)
			.chain(({ sub }) =>
				parse_body0<PlainData>(ctx).chain(data =>
					Oath.of({ fsid: ctx.params.fsid as FSID, createdBy: ctx.params.userId as SUB }).chain(
						({ fsid, createdBy }) =>
							dataService
								.update({ fsid, createdBy, updatedBy: sub, data })
								.rejectedMap(HttpError.NotFound),
					),
				),
			)
			.fork(send_error(ctx), result => {
				ctx.response.status = 200
				ctx.response.body = { success: true, result }
			})
