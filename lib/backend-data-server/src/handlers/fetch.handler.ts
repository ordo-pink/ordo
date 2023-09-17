// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Readable } from "stream"
import type { Middleware } from "koa"
import type { TDataCommands } from "@ordo-pink/data"
import type { Unary } from "@ordo-pink/tau"
import { sendError, authenticate0 } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"

export const handleFetch: Unary<
	{ dataService: TDataCommands<Readable>; idHost: string },
	Middleware
> =
	({ dataService, idHost }) =>
	ctx =>
		authenticate0(ctx, idHost)
			.map(({ payload }) => payload)
			.chain(({ sub }) => dataService.fetch({ createdBy: sub }).rejectedMap(HttpError.NotFound))
			.fork(sendError(ctx), result => {
				ctx.response.status = 200
				ctx.response.body = { success: true, result }
			})