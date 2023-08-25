// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Unary } from "@ordo-pink/tau"
import { logRequest } from "./log-request"
import { setResponseTimeHeader } from "./set-response-time-header"
import { handleError } from "./use-error"
import cors from "koa-cors"
import { ConsoleLogger, Logger } from "@ordo-pink/logger"
import { identity } from "ramda"
import Router from "@koa/router"
import Application from "koa"
import { Either } from "@ordo-pink/either/mod"
import bodyparser from "koa-bodyparser"

export type CreateServerParams = {
	origin?: string | string[]
	logger?: Logger
	serverName: string
	extendRouter?: Unary<Router, Router>
}
export type CreateServerFn = Unary<CreateServerParams, Application>

export const createServer: CreateServerFn = ({
	origin,
	serverName,
	extendRouter = identity,
	logger = ConsoleLogger,
}) => {
	const router = extendRouter(new Router())

	router.get("/healthcheck", ctx => {
		ctx.response.body = "OK"
		ctx.response.status = 200
	})

	const app = new Application()

	app.use(setResponseTimeHeader)
	app.use(bodyparser())
	app.use(handleError({ logger }))
	app.use(logRequest({ logger, serverName }))
	app.use(
		cors({
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
			origin: ctx =>
				Either.fromNullable(ctx.get("Origin"))
					.chain(o =>
						Either.fromNullable(origin)
							.chain(os =>
								Either.fromBoolean(
									() => Array.isArray(os),
									() => (os as string[]).includes(o as string),
									() => o === os,
								),
							)
							.map(allowed => (allowed ? (o as string) : ""))
							.leftMap(allowed => (allowed ? (o as string) : "")),
					)
					.leftMap(result => (result === null ? "" : result))
					.fold(identity, identity),
			credentials: true,
		}),
	)
	app.use(router.routes())
	app.use(router.allowedMethods())

	return app
}
