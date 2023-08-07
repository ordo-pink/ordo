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
import { FileModel } from "#lib/universal-data-service/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { prop } from "#ramda"
import { pathParamToFilePath } from "../utils.ts"

// --- PUBLIC ---

export const handleGetFile: Fn =
	({ dataService, idHost }) =>
	ctx =>
		Oath.from(() => useBearerAuthorization(ctx, idHost))
			.map(prop("payload"))
			.chain(({ sub }) =>
				getPath0(ctx.params as unknown as Record<"path", string>)
					.chain(validateIsValidPath0(ctx))
					.chain(getFileContent0({ service: dataService, sub }))
					.rejectedMap(e =>
						e.message === "File not found" ? new httpErrors.NotFound("Not found") : e
					)
			)
			.chain(throwIfFileDoesNotExist0)
			.fork(ResponseError.send(ctx), formGetFileResponse(ctx))

// --- INTERNAL ---

type Params = { dataService: DATA_SERVICE_TYPES.TDataService<ReadableStream>; idHost: string }
type Fn = Unary<Params, RouterMiddleware<"/files/:userId/:path*">>

// ---

type GetPathFn = Unary<Record<"path", Optional<string>>, Oath<string, never>>
const getPath0: GetPathFn = params => Oath.of(params.path ? pathParamToFilePath(params.path) : "/")

// ---

type ValidateIsValidPathFn = Curry<
	Binary<Context, string, Oath<DATA_SERVICE_TYPES.FilePath, Error>>
>
const validateIsValidPath0: ValidateIsValidPathFn = ctx => path =>
	Oath.try(() => (FileModel.isValidPath(path) ? path : ctx.throw(400, "Invalid file path")))

// ---

type GetFileContentFnParams = { service: Params["dataService"]; sub: SUB }
type GetFileContentFn = Curry<
	Binary<GetFileContentFnParams, DATA_SERVICE_TYPES.FilePath, Oath<Nullable<ReadableStream>, Error>>
>
const getFileContent0: GetFileContentFn =
	({ service, sub }) =>
	path =>
		service.getFileContent({ sub, path })

// ---

type ThrowIfFileDoesNotExistFn = Unary<Nullable<ReadableStream>, Oath<ReadableStream, Error>>
const throwIfFileDoesNotExist0: ThrowIfFileDoesNotExistFn = file =>
	Oath.fromNullable(file).rejectedMap(() => new httpErrors.NotFound("Not found"))

// ---

type FormGetFileResponseFn = Curry<Binary<Context, ReadableStream, void>>
const formGetFileResponse: FormGetFileResponseFn = ctx => file => {
	const body = file as ReadableStream<Uint8Array>
	ctx.request.originalRequest.respond(new Response(body))
}
