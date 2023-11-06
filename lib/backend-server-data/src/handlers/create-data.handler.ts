// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Readable } from "stream"
import type { Middleware } from "koa"
import type { FSID, TDataCommands } from "@ordo-pink/data"
import { sendError, authenticate0, parseBody0 } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"

type Params = { dataService: TDataCommands<Readable>; idHost: string }

export const handleCreateData =
	({ dataService, idHost }: Params): Middleware =>
	ctx =>
		authenticate0(ctx, idHost)
			.chain(({ payload }) =>
				dataService.dataPersistenceStrategy
					.count(payload.sub)
					.rejectedMap(() => HttpError.NotFound("User not found"))
					.chain(
						Oath.ifElse(totalFiles => totalFiles < payload.lim, {
							onFalse: () => HttpError.PaymentRequired("Subscription file limit exceeded"),
						}),
					)
					.map(() => payload),
			)
			.chain(({ sub, lim }) =>
				parseBody0<{ name: string; parent: FSID | null; fsid?: FSID; labels?: string[] }>(
					ctx,
				).chain(({ name, parent, fsid, labels }) =>
					Oath.of(ctx.params.userId).chain(() =>
						dataService
							.create({ createdBy: sub, name, parent, fsid, fileLimit: lim, labels })
							.rejectedMap(HttpError.Conflict),
					),
				),
			)
			.fork(sendError(ctx), result => {
				ctx.response.status = 201
				ctx.response.body = { success: true, result }
			})
