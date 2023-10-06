// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { prop } from "ramda"
import { join } from "path"
import { ConsoleLogger } from "@ordo-pink/logger"
import { fileExists0 } from "@ordo-pink/fs"
import { getc } from "@ordo-pink/getc"
import { Oath } from "@ordo-pink/oath"
import { Context, Gear, Router } from "@ordo-pink/routary"
import { logBunRequest } from "@ordo-pink/backend-utils"
import { BunFile, resolve } from "bun"
import { extend } from "@ordo-pink/tau"

const { STATIC_ROOT, STATIC_PORT } = getc(["STATIC_ROOT", "STATIC_PORT"])
const logger = ConsoleLogger
const serverName = "st"
const log = logBunRequest({ logger, serverName })

ConsoleLogger.info(`STATIC server running on http://localhost:${STATIC_PORT}`)

const setHeader = (key: string, value: string) => (ctx: Context) => {
	ctx.res.headers[key] = value
	return ctx
}

Bun.serve({
	port: Number(STATIC_PORT),
	fetch: Router.create()
		.get(/\/.*/, ctx =>
			Oath.of(ctx)
				.chain(ctx =>
					Oath.of(performance.now()).chain(time =>
						Oath.of(new URL(ctx.req.url))
							.map(prop("pathname"))
							.map(pathname => join(STATIC_ROOT, pathname))
							.chain(path =>
								fileExists0(path).chain(Oath.ifElse(Boolean, { onTrue: () => Bun.file(path) })),
							)
							.map(file => ({ file, time })),
					),
				)
				.tap(({ time }) =>
					ctx.res.setHeader("x-response-time", `${Math.ceil(performance.now() - time)}`),
				)
				.tap(() => ctx.res.setStatus(200))
				.tap(({ file }) => {
					ctx.res.setBody(file)
					ctx.res.setHeader("content-type", file.type)
				})
				.tap(
					() => log(ctx),
					() => log(ctx),
				),
		)
		.orElse(() => void 0),
})
