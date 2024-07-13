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

import { Middleware } from "koa"
import chalk from "chalk"
import { lte } from "ramda"

import { Context } from "@ordo-pink/routary"
import { Switch } from "@ordo-pink/switch"
import { TLogger } from "@ordo-pink/logger"

export type LogRequestOptions = {
	logger: TLogger
	serverName: string
}

export type LogRequestFn = (options: LogRequestOptions) => Middleware

export const logRequest: LogRequestFn = options => async (ctx, next) => {
	await next()

	const name = options.serverName
	const url = ctx.request.url.toString()
	const method = chalk.cyan(ctx.request.method.concat(" ".repeat(7 - ctx.request.method.length)))
	const responseStatus = ctx.response.status
	const responseTimeHeader = Number(ctx.get("X-Response-Time"))

	const status = Switch.Match(responseStatus)
		.case(lte(500), () => chalk.red(responseStatus.toString()))
		.case(lte(400), () => chalk.yellow(responseStatus.toString()))
		.case(lte(300), () => chalk.cyan(responseStatus.toString()))
		.case(lte(200), () => chalk.green(responseStatus.toString()))
		.default(() => responseStatus.toString())

	const rt = Switch.Match(responseTimeHeader)
		.case(lte(300), () => chalk.red(`${responseTimeHeader}ms`))
		.case(lte(200), () => chalk.yellow(`${responseTimeHeader}ms`))
		.case(lte(100), () => chalk.cyan(`${responseTimeHeader}ms`))
		.default(() => chalk.green(`${responseTimeHeader}ms`))

	options?.logger.info(`${name} - ${rt} - ${status} ${method} ${url}`)
}

export const logBunRequest = (options: LogRequestOptions) => (ctx: Context) => {
	const name = options.serverName
	const urlObject = new URL(ctx.req.url)
	const url = urlObject.pathname.concat(urlObject.search)
	const method = chalk.cyan(ctx.req.method.concat(" ".repeat(7 - ctx.req.method.length)))
	const responseStatus = ctx.res.status
	const responseTimeHeader = Math.ceil(
		Number(ctx.res.headers["x-response-time"].slice(0, -2)) / 1000,
	)

	const status = Switch.Match(responseStatus)
		.case(lte(500), () => chalk.red(responseStatus.toString()))
		.case(lte(400), () => chalk.yellow(responseStatus.toString()))
		.case(lte(300), () => chalk.cyan(responseStatus.toString()))
		.case(lte(200), () => chalk.green(responseStatus.toString()))
		.default(() => responseStatus.toString())

	const rt = Switch.Match(responseTimeHeader)
		.case(lte(300), () => chalk.red(`${responseTimeHeader}ms`))
		.case(lte(200), () => chalk.yellow(`${responseTimeHeader}ms`))
		.case(lte(100), () => chalk.cyan(`${responseTimeHeader}ms`))
		.default(() => chalk.green(`${responseTimeHeader}ms`))

	options?.logger.info(`${name} - ${rt} - ${status} ${method} ${url}`)
}
