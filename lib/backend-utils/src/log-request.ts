// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Middleware } from "koa"
import { Switch } from "@ordo-pink/switch"
import { lte } from "ramda"
import { Logger } from "@ordo-pink/logger"
import chalk from "chalk"

export type LogRequestOptions = {
	logger: Logger
	serverName: string
}

export type LogRequestFn = (options: LogRequestOptions) => Middleware

export const logRequest: LogRequestFn = options => async (ctx, next) => {
	await next()

	const name = options.serverName
	const ip = ctx.request.ip
	const url = ctx.request.url.toString()
	const method = chalk.cyan(ctx.request.method)
	const responseStatus = ctx.response.status
	const responseTimeHeader = Number(ctx.response.headers["X-Response-Time"])

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

	options?.logger.info(`${ip} ${status} ${method} ${url} - ${rt} - ${name}`)
}
