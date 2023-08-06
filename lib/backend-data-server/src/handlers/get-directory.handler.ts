// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { httpErrors, type Context, type RouterMiddleware } from "#x/oak@v12.6.0/mod.ts"
import type * as DATA_SERVICE_TYPES from "#lib/universal-data-service/mod.ts"
import type { Binary, Curry, Nullable, Optional, Unary } from "#lib/tau/mod.ts"
import type { SUB } from "#lib/backend-token-service/mod.ts"

import { ResponseError, useBearerAuthorization } from "#lib/backend-utils/mod.ts"
import { DirectoryModel } from "#lib/universal-data-service/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { prop } from "#ramda"
import { pathParamToDirectoryPath } from "../utils.ts"

// --- PUBLIC ---

export const handleGetDirectory: Fn =
	({ dataService, idHost }) =>
	ctx =>
		Oath.from(() => useBearerAuthorization(ctx, idHost))
			.map(prop("payload"))
			.chain(({ sub }) =>
				getPath0(ctx.params as Record<"path*", Optional<string>>)
					.chain(validateIsValidPath0(ctx))
					.chain(getDirectory0({ service: dataService, sub }))
			)
			.chain(throwIfDirectoryDoesNotExist0)
			.fork(ResponseError.send(ctx), formGetDirectoryResponse(ctx))

// --- INTERNAL ---

type Params = { dataService: DATA_SERVICE_TYPES.TDataService<ReadableStream>; idHost: string }
type Fn = Unary<Params, RouterMiddleware<"/directories/:userId/:path*" | "/directories/:userId">>

// ---

type GetPathFn = Unary<Record<"path*", Optional<string>>, Oath<string, never>>
const getPath0: GetPathFn = params =>
	Oath.of(params["path*"] ? pathParamToDirectoryPath(params["path*"]) : "/")

// ---

type ValidateIsValidPathFn = Curry<
	Binary<Context, string, Oath<DATA_SERVICE_TYPES.DirectoryPath, Error>>
>
const validateIsValidPath0: ValidateIsValidPathFn = ctx => path =>
	Oath.try(() =>
		DirectoryModel.isValidPath(path) ? path : ctx.throw(400, "Invalid directory path")
	)

// ---

type GetDirectoryFnParams = { service: Params["dataService"]; sub: SUB }
type GetDirectoryFn = Curry<
	Binary<
		GetDirectoryFnParams,
		DATA_SERVICE_TYPES.DirectoryPath,
		Oath<Nullable<DATA_SERVICE_TYPES.Directory>, Error>
	>
>
const getDirectory0: GetDirectoryFn =
	({ service, sub }) =>
	path =>
		service.getDirectory({ sub, path })

// ---

type ThrowIfDirectoryDoesNotExistFn = Unary<
	Nullable<DATA_SERVICE_TYPES.Directory>,
	Oath<DATA_SERVICE_TYPES.Directory, Error>
>
const throwIfDirectoryDoesNotExist0: ThrowIfDirectoryDoesNotExistFn = directory =>
	Oath.fromNullable(directory).rejectedMap(() => new httpErrors.NotFound("Not found"))

// ---

type FormGetDirectoryResponseFn = Curry<Binary<Context, DATA_SERVICE_TYPES.Directory, void>>
const formGetDirectoryResponse: FormGetDirectoryResponseFn = ctx => directory => {
	ctx.response.status = 200
	ctx.response.body = {
		success: true,
		result: directory,
	}
}
