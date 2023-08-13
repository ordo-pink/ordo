// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { httpErrors, type Context, type RouterMiddleware } from "#x/oak@v12.6.0/mod.ts"
import type * as DATA_SERVICE_TYPES from "#lib/backend-data-service/mod.ts"
import type { Binary, Curry, Nullable, Unary } from "#lib/tau/mod.ts"
import type { SUB } from "#lib/backend-token-service/mod.ts"

import { ResponseError, useBearerAuthorization } from "#lib/backend-utils/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { prop } from "#ramda"

// --- Public ---

export const handleGetRoot: Fn =
	({ dataService, idHost }) =>
	ctx =>
		Oath.from(() => useBearerAuthorization(ctx, idHost))
			.map(prop("payload"))
			.chain(({ sub }) => getDirectory0({ service: dataService, sub }))
			.rejectedMap(e =>
				e.message.startsWith("No such file or directory") ? new httpErrors.NotFound("Not found") : e
			)
			.chain(throwIfDirectoryDoesNotExist0)
			.fork(ResponseError.send(ctx), formGetDirectoryResponse(ctx))

// --- Internal ---

type Params = { dataService: DATA_SERVICE_TYPES.TDataService<ReadableStream>; idHost: string }
type Fn = Unary<Params, RouterMiddleware<"/directories/:userId">>

// ---

type GetDirectoryFnParams = { service: Params["dataService"]; sub: SUB }
type GetDirectoryFn = Curry<
	Unary<
		GetDirectoryFnParams,
		Oath<Nullable<Array<DATA_SERVICE_TYPES.Directory | DATA_SERVICE_TYPES.File>>, Error>
	>
>
const getDirectory0: GetDirectoryFn = ({ service, sub }) => service.getRoot(sub)

// ---

type ThrowIfDirectoryDoesNotExistFn = Unary<
	Nullable<Array<DATA_SERVICE_TYPES.Directory | DATA_SERVICE_TYPES.File>>,
	Oath<Array<DATA_SERVICE_TYPES.Directory | DATA_SERVICE_TYPES.File>, Error>
>
const throwIfDirectoryDoesNotExist0: ThrowIfDirectoryDoesNotExistFn = items =>
	Oath.fromNullable(items).rejectedMap(() => new httpErrors.NotFound("Not found"))

// ---

type FormGetDirectoryResponseFn = Curry<
	Binary<Context, Array<DATA_SERVICE_TYPES.Directory | DATA_SERVICE_TYPES.File>, void>
>
const formGetDirectoryResponse: FormGetDirectoryResponseFn = ctx => directory => {
	ctx.response.status = 200
	ctx.response.body = {
		success: true,
		result: directory,
	}
}
