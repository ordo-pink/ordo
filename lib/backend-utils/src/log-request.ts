// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Middleware } from "koa"
import chalk from "chalk"
import { lte } from "ramda"

import { Context } from "@ordo-pink/routary"
import { Logger } from "@ordo-pink/logger"
import { Switch } from "@ordo-pink/switch"

export type LogRequestOptions = {
	logger: Logger
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

	const status = Switch.of(responseStatus)
		.case(lte(500), () => chalk.red(responseStatus.toString()))
		.case(lte(400), () => chalk.yellow(responseStatus.toString()))
		.case(lte(300), () => chalk.cyan(responseStatus.toString()))
		.case(lte(200), () => chalk.green(responseStatus.toString()))
		.default(() => responseStatus.toString())

	const rt = Switch.of(responseTimeHeader)
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

	const status = Switch.of(responseStatus)
		.case(lte(500), () => chalk.red(responseStatus.toString()))
		.case(lte(400), () => chalk.yellow(responseStatus.toString()))
		.case(lte(300), () => chalk.cyan(responseStatus.toString()))
		.case(lte(200), () => chalk.green(responseStatus.toString()))
		.default(() => responseStatus.toString())

	const rt = Switch.of(responseTimeHeader)
		.case(lte(300), () => chalk.red(`${responseTimeHeader}ms`))
		.case(lte(200), () => chalk.yellow(`${responseTimeHeader}ms`))
		.case(lte(100), () => chalk.cyan(`${responseTimeHeader}ms`))
		.default(() => chalk.green(`${responseTimeHeader}ms`))

	options?.logger.info(`${name} - ${rt} - ${status} ${method} ${url}`)
}
