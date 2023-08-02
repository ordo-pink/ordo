// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// deno-lint-ignore-file no-explicit-any

import type { Context } from "#x/oak@v12.6.0/mod.ts"
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
	} else {
		ctx.response.status = 500
		console.log(err)
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
