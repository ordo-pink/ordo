// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Readable } from "stream"
import type { Middleware } from "koa"
import type { TDataCommands } from "@ordo-pink/data"
import { sendError, authenticate0 } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"

type Params = { dataService: TDataCommands<Readable>; idHost: string }

export const handleGetAllData =
	({ dataService, idHost }: Params): Middleware =>
	ctx =>
		authenticate0(ctx, idHost)
			.map(({ payload }) => payload)
			.chain(({ sub }) => dataService.fetch({ createdBy: sub }).rejectedMap(HttpError.NotFound))
			.fork(sendError(ctx), result => {
				ctx.response.status = 200
				ctx.response.body = { success: true, result }
			})
