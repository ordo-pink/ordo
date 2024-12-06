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

import { Middleware } from "koa"
import chalk from "chalk"

import { Context } from "@ordo-pink/routary"
import { Switch } from "@ordo-pink/switch"
import { TLogger } from "@ordo-pink/logger"
import { lte } from "@ordo-pink/tau"

export type TLogRequestOptions = {
	logger: TLogger
	server_name: string
}

export type TLogRequestFn = (options: TLogRequestOptions) => Middleware

export const log_request: TLogRequestFn =
	({ logger, server_name }) =>
	async (ctx, next) => {
		await next()

		const url = ctx.request.url.toString()
		const method = chalk.cyan(ctx.request.method.concat(" ".repeat(7 - ctx.request.method.length)))
		const response_status = ctx.response.status
		const response_time_header = Number(ctx.get("X-Response-Time"))

		const status = Switch.Match(response_status)
			.case(lte(500), () => chalk.red(response_status.toString()))
			.case(lte(400), () => chalk.yellow(response_status.toString()))
			.case(lte(300), () => chalk.cyan(response_status.toString()))
			.case(lte(200), () => chalk.green(response_status.toString()))
			.default(() => response_status.toString())

		const rt = Switch.Match(response_time_header)
			.case(lte(300), () => chalk.red(`${response_time_header}ms`))
			.case(lte(200), () => chalk.yellow(`${response_time_header}ms`))
			.case(lte(100), () => chalk.cyan(`${response_time_header}ms`))
			.default(() => chalk.green(`${response_time_header}ms`))

		logger.info(`${server_name} - ${rt} - ${status} ${method} ${url}`)
	}

export const log_bun_request =
	({ logger, server_name }: TLogRequestOptions) =>
	(ctx: Context) => {
		const url_object = new URL(ctx.req.url)
		const url = url_object.pathname.concat(url_object.search)
		const method = chalk.cyan(ctx.req.method.concat(" ".repeat(7 - ctx.req.method.length)))
		const response_status = ctx.res.status
		const response_time_header = Math.ceil(Number(ctx.res.headers["x-response-time"].slice(0, -2)) / 1000)

		const status = Switch.Match(response_status)
			.case(lte(500), () => chalk.red(response_status.toString()))
			.case(lte(400), () => chalk.yellow(response_status.toString()))
			.case(lte(300), () => chalk.cyan(response_status.toString()))
			.case(lte(200), () => chalk.green(response_status.toString()))
			.default(() => response_status.toString())

		const rt = Switch.Match(response_time_header)
			.case(lte(300), () => chalk.red(`${response_time_header}ms`))
			.case(lte(200), () => chalk.yellow(`${response_time_header}ms`))
			.case(lte(100), () => chalk.cyan(`${response_time_header}ms`))
			.default(() => chalk.green(`${response_time_header}ms`))

		logger.info(`${server_name} - ${rt} - ${status} ${method} ${url}`)
	}
