// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { httpErrors, type Context, type Middleware } from "#x/oak@v12.6.0/mod.ts"
import type * as DATA_SERVICE_TYPES from "#lib/backend-data-service/mod.ts"
import type { SUB } from "#lib/backend-token-service/mod.ts"
import type { Binary, Curry, Unary } from "#lib/tau/mod.ts"

import { ResponseError, useBearerAuthorization, useBody } from "#lib/backend-utils/mod.ts"
import { DirectoryModel } from "#lib/backend-data-service/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { prop } from "#ramda"

// --- Public ---

export const handleCreateDirectory: Fn =
	({ dataService, idHost }) =>
	ctx =>
		Oath.from(() => useBearerAuthorization(ctx, idHost))
			.map(prop("payload"))
			.chain(({ sub }) =>
				Oath.from(() => useBody<DATA_SERVICE_TYPES.DirectoryCreateParams>(ctx))
					.chain(validateCreateDirectoryParams0({ ctx, sub, service: dataService }))
					.chain(createDirectory0({ service: dataService, sub }))
					.rejectedMap(e =>
						e.message === "Directory already exists" ? new httpErrors.Conflict(e.message) : e,
					),
			)
			.fork(ResponseError.send(ctx), formCreateDirectoryResponse(ctx))

// --- Internal ---

type Params = { dataService: DATA_SERVICE_TYPES.TDataService<ReadableStream>; idHost: string }
type Fn = Unary<Params, Middleware>

// ---

type ValidateCreateDirectoryParams = {
	ctx: Context
	sub: SUB
	service: DATA_SERVICE_TYPES.TDataService<ReadableStream>
}
type ValidateCreateDirectoryParamsFn = Curry<
	Binary<
		ValidateCreateDirectoryParams,
		DATA_SERVICE_TYPES.DirectoryCreateParams,
		Oath<DATA_SERVICE_TYPES.DirectoryCreateParams, Error>
	>
>
const validateCreateDirectoryParams0: ValidateCreateDirectoryParamsFn =
	({ ctx, sub, service }) =>
	params =>
		Oath.try(() =>
			DirectoryModel.isValidPath(params.path) ? params : ctx.throw(400, "Invalid directory path"),
		)
			.chain(({ path }) =>
				Oath.fromNullable(DirectoryModel.getParentPath(path))
					.chain(path => service.checkDirectoryExists({ path, sub }))
					.rejectedMap(() => new httpErrors.BadRequest("Invalid directory path")),
			)
			.chain(exists =>
				Oath.try(() => (exists ? params : ctx.throw(404, "Missing parent directory"))),
			)

// ---

type CreateDirectoryFnParams = { service: Params["dataService"]; sub: SUB }
type CreateDirectoryFn = Curry<
	Binary<
		CreateDirectoryFnParams,
		DATA_SERVICE_TYPES.DirectoryCreateParams,
		Oath<DATA_SERVICE_TYPES.Directory, Error>
	>
>
const createDirectory0: CreateDirectoryFn =
	({ service, sub }) =>
	directory =>
		service.createDirectory({ sub, directory })

// ---

type FormCreateDirectoryResponseFn = Curry<Binary<Context, DATA_SERVICE_TYPES.Directory, void>>
const formCreateDirectoryResponse: FormCreateDirectoryResponseFn = ctx => directory => {
	ctx.response.status = 201
	ctx.response.body = {
		success: true,
		result: directory,
	}
}
