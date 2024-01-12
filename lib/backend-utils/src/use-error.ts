// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Logger } from "@ordo-pink/logger"
import { HttpError } from "@ordo-pink/rrr"
import { Context, Middleware } from "koa"

export const sendError = (ctx: Context) => (err: HttpError) => {
	// TODO: Use logger
	console.log(err)
	ctx.response.status = typeof err.status === "number" ? err.status : 500
	ctx.response.body = { success: false, error: err.message }
}

export type HandleErrorParams = { logger: Logger }

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
