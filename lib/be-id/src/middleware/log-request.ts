// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import { Middleware } from "#x/oak@v12.6.0/mod.ts"
import { cyan, green, red, setColorEnabled, yellow } from "#std/fmt/colors.ts"
import { Switch } from "#lib/switch/mod.ts"
import { lte } from "#x/ramda@v0.27.2/mod.ts"

export type LogRequestOptions = {
	color?: boolean
}

export type LogRequestFn = (options?: LogRequestOptions) => Middleware

export const logRequest: LogRequestFn = options => async (ctx, next) => {
	await next()

	setColorEnabled(options?.color ?? true)

	const ip = ctx.request.ip
	const url = ctx.request.url.toString()
	const method = cyan(ctx.request.method)
	const responseStatus = ctx.response.status
	const time = new Date(Date.now()).toISOString()
	const responseTimeHeader = Number(ctx.response.headers.get("X-Response-Time"))

	const status = Switch.of(responseStatus)
		.case(lte(500), () => red(responseStatus.toString()))
		.case(lte(400), () => yellow(responseStatus.toString()))
		.case(lte(300), () => cyan(responseStatus.toString()))
		.case(lte(200), () => green(responseStatus.toString()))
		.default(() => responseStatus.toString())

	const rt = Switch.of(responseTimeHeader)
		.case(lte(300), () => red(`${responseTimeHeader}ms`))
		.case(lte(200), () => yellow(`${responseTimeHeader}ms`))
		.case(lte(100), () => cyan(`${responseTimeHeader}ms`))
		.default(() => green(`${responseTimeHeader}ms`))

	ctx.app.state.logger.log(`[${time}]: ${ip} ${status} ${method} ${url} - ${rt}`)
}
