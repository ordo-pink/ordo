// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { BunFile } from "bun"
import type { StaticMiddlewareState } from "./static.types"
import { join } from "path"
import { logBunRequest } from "@ordo-pink/backend-utils"
import { Router, Context } from "@ordo-pink/routary"
import { fileExists0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { Logger } from "@ordo-pink/logger"

type P = { root: string; logger: Logger; serverName: string }
export const createRouter = ({ root, logger, serverName }: P) =>
	Router.create()
		.get(/\/.*/, ctx =>
			Oath.of(ctx)
				.chain(ctx =>
					Oath.of(performance.now()).chain(time =>
						Oath.of(new URL(ctx.req.url))
							.map(extractPathnameFromURL)
							.map(createFullFilePath(root))
							.chain(openFileIfExists0)
							.bimap(createErrorMiddlewareContext(time), createMiddlewareContext(time))
							.bitap(setErrorBody(ctx), setResponseBody(ctx))
							.fix(x => x),
					),
				)
				.tap(setResponseTimeHeader(ctx))
				.tap(logRequestThunk(logger, serverName, ctx)),
		)
		.orElse(ctx => {
			console.log(ctx.req.url)
		})

// --- Internal ---

const extractPathnameFromURL = ({ pathname }: URL) => pathname

const createMiddlewareContext = (time: number) => (file: BunFile) => ({ file, time })

const createErrorMiddlewareContext = (time: number) => () => ({ time })

const createFullFilePath = (root: string) => (pathname: string) => join(root, pathname)

const logRequestThunk = (logger: Logger, serverName: string, ctx: Context) => () =>
	logBunRequest({ logger, serverName })(ctx)

const openFileIfExists0 = (path: string) =>
	fileExists0(path).chain(Oath.ifElse(Boolean, { onTrue: () => Bun.file(path) }))

const setResponseTimeHeader =
	(ctx: Context) =>
	({ time }: Pick<StaticMiddlewareState, "time">) =>
		ctx.res.setHeader("x-response-time", `${Math.ceil(performance.now() - time)}`)

const setResponseBody =
	(ctx: Context) =>
	({ file }: Pick<StaticMiddlewareState, "file">) => {
		ctx.res.setBody(file)
		ctx.res.setStatus(200)
		ctx.res.setHeader("content-type", file.type)
	}

const setErrorBody = (ctx: Context) => () => {
	ctx.res.setStatus(404)
	ctx.res.setHeader("content-type", "application/json")
	ctx.res.setBody(JSON.stringify({ success: false, message: "Not found" }))
}
