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
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
