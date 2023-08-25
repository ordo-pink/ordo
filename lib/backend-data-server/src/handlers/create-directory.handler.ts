// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Readable } from "stream"
import type { Middleware } from "koa"
import type { Unary } from "@ordo-pink/tau"
import { prop } from "ramda"
import { TDataService } from "@ordo-pink/backend-data-service"
import { sendError, useBearerAuthorization, useBody } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import { CreateDirectoryParams, DirectoryUtils } from "@ordo-pink/datautil"

export const handleCreateDirectory: Unary<
	{ dataService: TDataService<Readable>; idHost: string },
	Middleware
> =
	({ dataService, idHost }) =>
	ctx =>
		useBearerAuthorization(ctx, idHost)
			.map(prop("payload"))
			.chain(({ sub }) =>
				useBody<CreateDirectoryParams>(ctx, "object")
					.chain(body =>
						Oath.fromBoolean(
							() => DirectoryUtils.isCreateParams(body),
							() => body,
							() => HttpError.BadRequest("Invalid body"),
						)
							.chain(({ path }) =>
								Oath.fromNullable(DirectoryUtils.getParentPath(path))
									.chain(path => dataService.checkDirectoryExists({ path, sub }))
									.rejectedMap(() => HttpError.BadRequest("Parent directory does not exist")),
							)
							.chain(exists =>
								Oath.fromBoolean(
									() => exists,
									() => body,
									() => HttpError.NotFound("Missing parent directory"),
								),
							),
					)
					.chain(params =>
						dataService
							.createDirectory({ sub, params })
							.rejectedMap(() => HttpError.Conflict("Directory already exists")),
					),
			)
			.fork(sendError(ctx), result => {
				ctx.response.status = 201
				ctx.response.body = { success: true, result }
			})
