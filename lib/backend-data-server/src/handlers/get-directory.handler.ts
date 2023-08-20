// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Context, Middleware } from "koa"
import type { Binary, Curry, Nullable, Optional, Unary } from "@ordo-pink/tau"
import type * as DATA_SERVICE_TYPES from "@ordo-pink/backend-data-service"
import type { SUB } from "@ordo-pink/backend-token-service"
import { prop } from "ramda"
import { sendError, useBearerAuthorization } from "@ordo-pink/backend-utils"
import { DirectoryModel } from "@ordo-pink/backend-data-service"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import { pathParamToDirectoryPath } from "../utils"

// --- Public ---

export const handleGetDirectory: Fn =
	({ dataService, idHost }) =>
	ctx =>
		useBearerAuthorization(ctx, idHost)
			.map(prop("payload"))
			.chain(({ sub }) =>
				getPath0(ctx.params)
					.chain(validateIsValidPath0(ctx))
					.chain(getDirectory0({ service: dataService, sub })),
			)
			.fork(sendError(ctx), formGetDirectoryResponse(ctx))

// --- Internal ---

type Params = { dataService: DATA_SERVICE_TYPES.TDataService<ReadableStream>; idHost: string }
type Fn = Unary<Params, Middleware<{ params: { userId: string; path: string } }>>

// ---

type GetPathFn = Unary<Record<"path", Optional<string>>, Oath<string, never>>
const getPath0: GetPathFn = params =>
	Oath.of(params.path ? pathParamToDirectoryPath(params.path) : "/")

// ---

type ValidateIsValidPathFn = Curry<
	Binary<Context, string, Oath<DATA_SERVICE_TYPES.DirectoryPath, HttpError>>
>
const validateIsValidPath0: ValidateIsValidPathFn = ctx => path =>
	Oath.try(() => {
		if (!DirectoryModel.isValidPath(path)) throw HttpError.BadRequest("Invalid directory path")
		return path
	})

// ---

type GetDirectoryFnParams = { service: Params["dataService"]; sub: SUB }
type GetDirectoryFn = Curry<
	Binary<
		GetDirectoryFnParams,
		DATA_SERVICE_TYPES.DirectoryPath,
		Oath<DATA_SERVICE_TYPES.Directory, HttpError>
	>
>
const getDirectory0: GetDirectoryFn =
	({ service, sub }) =>
	path =>
		service
			.getDirectory({ sub, path })
			.chain(Oath.fromNullable)
			.rejectedMap(() => HttpError.NotFound("Not found"))

// ---

type FormGetDirectoryResponseFn = Curry<Binary<Context, DATA_SERVICE_TYPES.Directory, void>>
const formGetDirectoryResponse: FormGetDirectoryResponseFn = ctx => directory => {
	ctx.response.status = 200
	ctx.response.body = {
		success: true,
		result: directory,
	}
}
