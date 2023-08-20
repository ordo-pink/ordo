// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type * as DATA_SERVICE_TYPES from "@ordo-pink/backend-data-service"
import type { SUB } from "@ordo-pink/backend-token-service"
import type { Binary, Curry, Unary } from "@ordo-pink/tau"

import { sendError, useBearerAuthorization, useBody } from "@ordo-pink/backend-utils"
import { DirectoryModel } from "@ordo-pink/backend-data-service"
import { Oath } from "@ordo-pink/oath"
import { prop } from "ramda"
import { Middleware, Context } from "koa"
import { HttpError } from "@ordo-pink/rrr"

// --- Public ---

export const handleCreateDirectory: Fn =
	({ dataService, idHost }) =>
	ctx =>
		useBearerAuthorization(ctx, idHost)
			.map(prop("payload"))
			.chain(({ sub }) =>
				useBody<DATA_SERVICE_TYPES.DirectoryCreateParams>(ctx, "object")
					.chain(validateCreateDirectoryParams0({ ctx, sub, service: dataService }))
					.chain(createDirectory0({ service: dataService, sub }))
			)
			.fork(sendError(ctx), formCreateDirectoryResponse(ctx))

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
		Oath<DATA_SERVICE_TYPES.DirectoryCreateParams, HttpError>
	>
>
const validateCreateDirectoryParams0: ValidateCreateDirectoryParamsFn =
	({ ctx, sub, service }) =>
	params =>
		Oath.try(() => {
			if (!DirectoryModel.isValidPath(params.path))
				throw HttpError.BadRequest("Invalid directory path")
			return params
		})
			.chain(({ path }) =>
				Oath.fromNullable(DirectoryModel.getParentPath(path))
					.chain(path => service.checkDirectoryExists({ path, sub }))
					.rejectedMap(() => HttpError.BadRequest("Invalid directory path"))
			)
			.chain(exists =>
				Oath.try(() => {
					if (!exists) throw HttpError.NotFound("Missing parent directory")
					return params
				})
			)
			.rejectedMap(error => (error instanceof HttpError ? error : HttpError.from(error)))

// ---

type CreateDirectoryFnParams = { service: Params["dataService"]; sub: SUB }
type CreateDirectoryFn = Curry<
	Binary<
		CreateDirectoryFnParams,
		DATA_SERVICE_TYPES.DirectoryCreateParams,
		Oath<DATA_SERVICE_TYPES.Directory, HttpError>
	>
>
const createDirectory0: CreateDirectoryFn =
	({ service, sub }) =>
	directory =>
		service
			.createDirectory({ sub, directory })
			.rejectedMap(() => HttpError.Conflict("Directory already exists"))

// ---

type FormCreateDirectoryResponseFn = Curry<Binary<Context, DATA_SERVICE_TYPES.Directory, void>>
const formCreateDirectoryResponse: FormCreateDirectoryResponseFn = ctx => directory => {
	ctx.response.status = 201
	ctx.response.body = {
		success: true,
		result: directory,
	}
}
