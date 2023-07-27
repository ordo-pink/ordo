// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import { Middleware, HttpError } from "#x/oak@v12.6.0/mod.ts"

export const handleError: Middleware = async (ctx, next) => {
	try {
		await next()
	} catch (e) {
		if (e instanceof HttpError) {
			ctx.response.status = e.status
			ctx.response.body = { error: e.message }
		} else {
			ctx.app.state.logger.error(e)
		}
	}
}
