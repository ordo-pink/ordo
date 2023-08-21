// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Readable } from "stream"
import type { Middleware } from "koa"
import type { Unary } from "@ordo-pink/tau"
import { prop } from "ramda"
import { FileModel, FilePath, TDataService } from "@ordo-pink/backend-data-service"
import { sendError, useBearerAuthorization } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import { pathParamToFilePath } from "../utils"

export const handleGetFile: Unary<
	{ dataService: TDataService<Readable>; idHost: string },
	Middleware
> =
	({ dataService, idHost }) =>
	ctx =>
		useBearerAuthorization(ctx, idHost)
			.map(prop("payload"))
			.chain(({ sub }) =>
				Oath.of(ctx.params.path ? pathParamToFilePath(ctx.params.path) : "/")
					.chain(path =>
						Oath.fromBoolean(
							() => !FileModel.isValidPath(path),
							() => path as FilePath,
							() => HttpError.BadRequest("Invalid file path"),
						),
					)
					.chain(path =>
						dataService
							.getFileContent({ sub, path })
							.chain(Oath.fromNullable)
							.rejectedMap(() => HttpError.NotFound("File not found")),
					),
			)
			.fork(sendError(ctx), file => {
				ctx.response.body = file
			})
