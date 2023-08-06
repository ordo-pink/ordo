// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type { Context, Middleware } from "#x/oak@v12.6.0/mod.ts"
import type * as DATA_SERVICE_TYPES from "#lib/universal-data-service/mod.ts"
import type { SUB } from "#lib/backend-token-service/mod.ts"
import type { Binary, Curry, Unary } from "#lib/tau/mod.ts"

import { ResponseError, useBearerAuthorization, useBody } from "#lib/backend-utils/mod.ts"
import { DirectoryModel } from "#lib/universal-data-service/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { prop } from "#ramda"

// --- PUBLIC ---

export const handleCreateDirectory: Fn =
	({ dataService, idHost }) =>
	ctx =>
		Oath.from(() => useBearerAuthorization(ctx, idHost))
			.map(prop("payload"))
			.chain(({ sub }) =>
				Oath.from(() => useBody<DATA_SERVICE_TYPES.DirectoryCreateParams>(ctx))
					.chain(validateCreateDirectoryParams0(ctx))
					.chain(createDirectory0({ service: dataService, sub }))
			)
			.fork(ResponseError.send(ctx), formCreateDirectoryResponse(ctx))

// --- INTERNAL ---

type Params = { dataService: DATA_SERVICE_TYPES.TDataService<ReadableStream>; idHost: string }
type Fn = Unary<Params, Middleware>

// ---

type ValidateCreateDirectoryParamsFn = Curry<
	Binary<
		Context,
		DATA_SERVICE_TYPES.DirectoryCreateParams,
		Oath<DATA_SERVICE_TYPES.DirectoryCreateParams, Error>
	>
>
const validateCreateDirectoryParams0: ValidateCreateDirectoryParamsFn = ctx => params =>
	Oath.try(() =>
		DirectoryModel.isValidPath(params.path) ? params : ctx.throw(400, "Invalid directory path")
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
