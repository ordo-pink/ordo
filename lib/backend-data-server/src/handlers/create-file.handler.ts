// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Context, Middleware } from "koa"
import type * as DATA_SERVICE_TYPES from "@ordo-pink/backend-data-service"
import type { SUB } from "@ordo-pink/backend-token-service"
import type { Binary, Curry, Unary } from "@ordo-pink/tau"
import { prop } from "ramda"
import { sendError, useBearerAuthorization, useBody } from "@ordo-pink/backend-utils"
import { FileModel } from "@ordo-pink/backend-data-service"
import { Oath } from "@ordo-pink/oath"
import { HttpError } from "@ordo-pink/rrr"

// --- Public ---

export const handleCreateFile: Fn =
	({ dataService, idHost }) =>
	ctx =>
		useBearerAuthorization(ctx, idHost)
			.map(prop("payload"))
			.chain(({ sub }) =>
				useBody<DATA_SERVICE_TYPES.FileCreateParams>(ctx)
					.chain(validateCreateFileParams0(ctx))
					.chain(params =>
						createFile0({ service: dataService, sub })(params).rejectedMap(e =>
							ctx.throw(409, "File already exists"),
						),
					),
			)
			.fork(sendError(ctx), formCreateFileResponse(ctx))

// --- Internal ---

type Params = { dataService: DATA_SERVICE_TYPES.TDataService<ReadableStream>; idHost: string }
type Fn = Unary<Params, Middleware>

// ---

type ValidateCreateFileParamsFn = Curry<
	Binary<
		Context,
		DATA_SERVICE_TYPES.FileCreateParams,
		Oath<DATA_SERVICE_TYPES.FileCreateParams, HttpError>
	>
>
const validateCreateFileParams0: ValidateCreateFileParamsFn = ctx => params =>
	Oath.try(() => {
		if (!FileModel.isValidPath(params.path)) throw HttpError.BadRequest("Invalid file path")
		return params
	})

// ---

type CreateFileFnParams = { service: Params["dataService"]; sub: SUB }
type CreateFileFn = Curry<
	Binary<
		CreateFileFnParams,
		DATA_SERVICE_TYPES.FileCreateParams,
		Oath<DATA_SERVICE_TYPES.File, HttpError>
	>
>
const createFile0: CreateFileFn =
	({ service, sub }) =>
	file =>
		service.createFile({ sub, file }).rejectedMap(() => HttpError.Conflict("File already exists"))

// ---

type FormCreateFileResponseFn = Curry<Binary<Context, DATA_SERVICE_TYPES.File, void>>
const formCreateFileResponse: FormCreateFileResponseFn = ctx => file => {
	ctx.response.status = 201
	ctx.response.body = {
		success: true,
		result: file,
	}
}
