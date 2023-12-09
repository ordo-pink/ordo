// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { keysOf } from "@ordo-pink/tau"

export class HttpError extends Error {
	#status: number

	public static BadRequest(message: string, options?: ErrorOptions) {
		return new HttpError(400, message, options)
	}

	public static Unauthorized(message: string, options?: ErrorOptions) {
		return new HttpError(401, message, options)
	}

	public static PaymentRequired(message: string, options?: ErrorOptions) {
		return new HttpError(402, message, options)
	}

	public static Forbidden(message: string, options?: ErrorOptions) {
		return new HttpError(403, message, options)
	}

	public static NotFound(message: string, options?: ErrorOptions) {
		return new HttpError(404, message, options)
	}

	public static Conflict(message: string, options?: ErrorOptions) {
		return new HttpError(409, message, options)
	}

	public static LengthRequired(message: string, options?: ErrorOptions) {
		return new HttpError(411, message, options)
	}

	public static PayloadTooLarge(message: string, options?: ErrorOptions) {
		return new HttpError(413, message, options)
	}

	public static UnprocessableEntity(message: string, options?: ErrorOptions) {
		return new HttpError(422, message, options)
	}

	public static InternalServerError(message: string, options?: ErrorOptions) {
		return new HttpError(500, message, options)
	}

	public static from(err: Error, status = 500, options?: ErrorOptions) {
		return new HttpError(status, err.message, options)
	}

	protected constructor(status: number, message: string, options?: ErrorOptions) {
		super(message, options)
		this.#status = status
	}

	public get status() {
		return this.#status
	}
}

export const Errors = <T extends Record<string, string>>(
	supportedErrors: T,
): { [K in keyof T]: () => T[K] } & {
	UnexpectedError: (error: Error) => `Unexpected error: ${string}`
} => ({
	...keysOf(supportedErrors).reduce(
		(acc, key) => ({ ...acc, [key]: () => supportedErrors[key] }),
		{} as { [K in keyof T]: () => T[K] },
	),
	UnexpectedError: error => `Unexpected error: ${error.message}`,
})
