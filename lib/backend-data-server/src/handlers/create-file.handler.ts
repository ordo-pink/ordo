// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Context, Middleware } from "#x/oak@v12.6.0/mod.ts"
import type * as DATA_SERVICE_TYPES from "#lib/universal-data-service/mod.ts"
import type { SUB } from "#lib/backend-token-service/mod.ts"
import type { Binary, Curry, Unary } from "#lib/tau/mod.ts"

import { ResponseError, useBearerAuthorization, useBody } from "#lib/backend-utils/mod.ts"
import { FileModel } from "#lib/universal-data-service/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { prop } from "#ramda"

// --- PUBLIC ---

export const handleCreateFile: Fn =
	({ dataService, idHost }) =>
	ctx =>
		Oath.from(() => useBearerAuthorization(ctx, idHost))
			.map(prop("payload"))
			.chain(({ sub }) =>
				Oath.from(() => useBody<DATA_SERVICE_TYPES.FileCreateParams>(ctx))
					.chain(validateCreateFileParams0(ctx))
					.chain(createFile0({ service: dataService, sub }))
			)
			.fork(ResponseError.send(ctx), formCreateFileResponse(ctx))

// --- INTERNAL ---

type Params = { dataService: DATA_SERVICE_TYPES.TDataService<ReadableStream>; idHost: string }
type Fn = Unary<Params, Middleware>

// ---

type ValidateCreateFileParamsFn = Curry<
	Binary<
		Context,
		DATA_SERVICE_TYPES.FileCreateParams,
		Oath<DATA_SERVICE_TYPES.FileCreateParams, Error>
	>
>
const validateCreateFileParams0: ValidateCreateFileParamsFn = ctx => params =>
	Oath.try(() =>
		FileModel.isValidPath(params.path) ? params : ctx.throw(400, "Invalid file path")
	)

// ---

type CreateFileFnParams = { service: Params["dataService"]; sub: SUB }
type CreateFileFn = Curry<
	Binary<
		CreateFileFnParams,
		DATA_SERVICE_TYPES.FileCreateParams,
		Oath<DATA_SERVICE_TYPES.File, Error>
	>
>
const createFile0: CreateFileFn =
	({ service, sub }) =>
	file =>
		service.createFile({ sub, file })

// ---

type FormCreateFileResponseFn = Curry<Binary<Context, DATA_SERVICE_TYPES.File, void>>
const formCreateFileResponse: FormCreateFileResponseFn = ctx => file => {
	ctx.response.status = 201
	ctx.response.body = {
		success: true,
		result: file,
	}
}
