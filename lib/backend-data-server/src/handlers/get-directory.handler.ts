// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Readable } from "stream"
import type { Middleware } from "koa"
import type { Unary } from "@ordo-pink/tau"
import { prop } from "ramda"
import { DirectoryModel, TDataService } from "@ordo-pink/backend-data-service"
import { sendError, useBearerAuthorization } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import { pathParamToDirectoryPath } from "../utils"

export const handleGetDirectory: Unary<
	{ dataService: TDataService<Readable>; idHost: string },
	Middleware
> =
	({ dataService, idHost }) =>
	ctx =>
		useBearerAuthorization(ctx, idHost)
			.map(prop("payload"))
			.chain(({ sub }) =>
				Oath.of(ctx.params.path ? pathParamToDirectoryPath(ctx.params.path) : "/")
					.chain(path =>
						Oath.fromBoolean(
							() => DirectoryModel.isValidPath(path),
							() => path,
							() => HttpError.BadRequest("Invalid directory path"),
						),
					)
					.chain(path =>
						dataService
							.getDirectory({ sub, path })
							.chain(Oath.fromNullable)
							.rejectedMap(() => HttpError.NotFound("Not found")),
					),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
