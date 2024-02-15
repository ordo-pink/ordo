// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

export class HttpError extends Error {
	#status: number

	public static BadRequest(message: string) {
		return new HttpError(400, message)
	}

	public static Unauthorized(message: string) {
		return new HttpError(401, message)
	}

	public static PaymentRequired(message: string) {
		return new HttpError(402, message)
	}

	public static Forbidden(message: string) {
		return new HttpError(403, message)
	}

	public static NotFound(message: string) {
		return new HttpError(404, message)
	}

	public static Conflict(message: string) {
		return new HttpError(409, message)
	}

	public static LengthRequired(message: string) {
		return new HttpError(411, message)
	}

	public static PayloadTooLarge(message: string) {
		return new HttpError(413, message)
	}

	public static UnprocessableEntity(message: string) {
		return new HttpError(422, message)
	}

	public static InternalServerError(message: string) {
		return new HttpError(500, message)
	}

	public static from(err: Error, status = 500) {
		return new HttpError(status, err.message)
	}

	protected constructor(status: number, message: string) {
		super(message)
		this.#status = status
	}

	public get status() {
		return this.#status
	}
}
