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

import { Context, Middleware } from "koa"

import { HttpError } from "@ordo-pink/rrr"
import { TLogger } from "@ordo-pink/logger"

export const sendError = (ctx: Context) => (err: HttpError) => {
	// TODO: Use logger
	console.log(err)
	ctx.response.status = typeof err.status === "number" ? err.status : 500
	ctx.response.body = { success: false, error: err.message }
}

export type HandleErrorParams = { logger: TLogger }

export const handleError =
	(options: HandleErrorParams): Middleware =>
	async (ctx, next) => {
		try {
			await next()
		} catch (e) {
			if (e instanceof HttpError) {
				ctx.response.status = e.status
				ctx.response.body = { success: false, message: e.message }
			} else {
				ctx.response.status = 500
				options.logger.alert(e)
				ctx.response.body = { success: false, message: "Internal error" }
			}
		}
	}
