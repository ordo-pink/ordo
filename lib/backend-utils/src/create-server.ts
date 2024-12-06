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

import Application from "koa"
import Router from "@koa/router"
import bodyparser from "koa-bodyparser"
import cors from "koa-cors"

import { Result } from "@ordo-pink/result"
import { type TLogger } from "@ordo-pink/logger"

import { handle_error } from "./use-error"
import { log_request as log_request } from "./log-request"
import { set_response_time_header as set_response_time_header } from "./set-response-time-header"

export type TCreateServerParams = {
	origin: string | string[]
	logger: TLogger
	server_name: string
	extend_router: (router: Router) => Router
}
export type TCreateServerFn = (params: TCreateServerParams) => Application

export const create_koa_server: TCreateServerFn = ({ origin, extend_router, server_name, logger }) => {
	const router = extend_router(new Router())

	router.get("/healthcheck", ctx => {
		ctx.response.body = "OK"
		ctx.response.status = 200
	})

	const app = new Application()

	app.use(set_response_time_header)
	app.use(bodyparser())
	app.use(handle_error({ logger }))
	app.use(log_request({ logger, server_name }))
	app.use(
		cors({
			methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			origin: ctx =>
				Result.FromNullable(ctx.get("Origin"))
					.pipe(Result.ops.chain(o => Result.If(origin.includes(o), { T: () => o })))
					.cata({ Ok: x => x, Err: () => "" }),
			credentials: true,
		}),
	)
	app.use(router.routes())
	app.use(router.allowedMethods())

	return app
}
