/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { type Context, type Middleware } from "koa"
import chalk from "chalk"

import { RRR } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { type TLogger } from "@ordo-pink/logger"

type TSendErrorParams = { ctx: Context; logger: TLogger }
export const send_error = (params: TSendErrorParams) => (err: Ordo.Rrr) => {
	const { ctx, logger } = params

	logger.debug(`[${chalk.red(err.key)}] ${err.message} :: ${err.debug ?? "No debug info provided"}`)

	const status = Switch.Match(err.code)
		.case(RRR.enum.EACCES, () => 401)
		.case(RRR.enum.EEXIST, () => 409)
		.case(RRR.enum.EFBIG, () => 413)
		.case(RRR.enum.EINVAL, () => 400)
		.case(RRR.enum.EIO, () => 500)
		.case(RRR.enum.ENOENT, () => 404)
		.case(RRR.enum.ENOSPC, () => 507)
		.case(RRR.enum.EPERM, () => 403)
		.default(() => 500)

	ctx.response.status = status
	ctx.response.body = { success: false, error: `${err.code} ${err.key} ${err.message}` }
}

export type HandleErrorParams = { logger: TLogger }

export const handle_error =
	(options: HandleErrorParams): Middleware =>
	async (ctx, next) => {
		try {
			await next()
		} catch (e) {
			console.log(e)
			// if (e instanceof HttpError) {
			// 	ctx.response.status = e.status
			// 	ctx.response.body = { success: false, message: e.message }
			// } else {
			ctx.response.status = 500
			options.logger.alert(e)
			ctx.response.body = { success: false, message: "Internal error" }
			// }
		}
	}
