// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// deno-lint-ignore-file no-explicit-any

import { Context, Middleware, HttpError } from "#x/oak@v12.6.0/mod.ts"
import { Logger } from "#lib/logger/mod.ts"
import type * as T from "./types.ts"

export const sendError = (ctx: Context) => (err: T.HttpError | unknown) => {
	if (
		Array.isArray(err) &&
		err.length === 2 &&
		typeof err[0] === "number" &&
		typeof err[1] === "string" &&
		err[0] >= 100 &&
		err[0] < 600
	) {
		const [status, message] = err

		ctx.response.status = status
		ctx.response.body = { error: message }
	} else if (err instanceof HttpError) {
		ctx.response.status = err.status
		ctx.response.body = {
			error: err && (err as any).message ? (err as any).message : "Unknown error",
		}
	} else {
		ctx.response.status = 500
		console.log(err) // TODO: Replace with logger
		ctx.response.body = {
			error: err && (err as any).message ? (err as any).message : "Unknown error",
		}
	}
}

export const createHttpError =
	(status: number, message: string) =>
	(e: unknown): [number, string] =>
		e ? (e as any) : [status, message]

export const useResponseError = () => ({
	create: createHttpError,
	send: sendError,
})

export const ResponseError = useResponseError()

export type HandleErrorParams = { logger: Logger }

export const handleError =
	(options: HandleErrorParams): Middleware =>
	async (ctx, next) => {
		try {
			await next()
		} catch (e) {
			if (e instanceof HttpError || e.status) {
				ctx.response.status = e.status
				ctx.response.body = { success: false, message: e.message }
			} else {
				ctx.response.status = 500
				options.logger.notice(e)
				ctx.response.body = { success: false, message: "Internal error" }
			}
		}
	}
