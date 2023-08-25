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
import { CreateFileParams, FileUtils } from "@ordo-pink/datautil"

export const handleCreateFile: Unary<
	{ dataService: TDataService<Readable>; idHost: string },
	Middleware
> =
	({ dataService, idHost }) =>
	ctx =>
		useBearerAuthorization(ctx, idHost)
			.map(prop("payload"))
			.chain(({ sub }) =>
				useBody<CreateFileParams>(ctx)
					.chain(body =>
						Oath.fromBoolean(
							() => FileUtils.isCreateParams(body),
							() => body,
							() => HttpError.BadRequest("Invalid body"),
						),
					)
					.chain(params =>
						dataService
							.createFile({ sub, params })
							.rejectedMap(() => HttpError.Conflict("File already exists")),
					),
			)
			.fork(sendError(ctx), result => {
				ctx.response.status = 201
				ctx.response.body = { success: true, result }
			})
