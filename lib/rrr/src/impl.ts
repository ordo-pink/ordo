// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

export class HttpError {
	public status: number
	public message: string

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
		this.status = status
		this.message = message
	}
}
