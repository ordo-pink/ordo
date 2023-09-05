// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Unary } from "@ordo-pink/tau"
import type { Readable } from "stream"
import type { Middleware } from "koa"
import { prop } from "ramda"
import { TDataService } from "@ordo-pink/backend-data-service"
import { sendError, useBearerAuthorization } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import { pathParamToDirectoryPath } from "../utils"
import { DirectoryPath, DirectoryUtils } from "@ordo-pink/data"

// --- Public ---

export const handleRemoveDirectory: Unary<
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
							() => DirectoryUtils.isValidPath(path),
							() => path as DirectoryPath,
							() => HttpError.BadRequest("Invalid directory path"),
						),
					)
					.chain(path =>
						dataService
							.removeDirectory({ sub, path })
							.chain(Oath.fromNullable)
							.rejectedMap(() => HttpError.NotFound("Directory not found")),
					),
			)
			.fork(sendError(ctx), result => {
				ctx.response.status = 200
				ctx.response.body = { success: true, result }
			})
