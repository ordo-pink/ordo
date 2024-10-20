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

import type { BunFile } from "bun"
import { join } from "path"

import { Context, Router } from "@ordo-pink/routary"
import { Oath, ops0 } from "@ordo-pink/oath"
import { TLogger } from "@ordo-pink/logger"
import { file_exists0 } from "@ordo-pink/fs"
import { log_bun_request } from "@ordo-pink/backend-utils"

import type { StaticMiddlewareState } from "./static.types"

type P = { root: string; logger: TLogger; serverName: string }
export const createRouter = ({ root, logger, serverName }: P) =>
	Router.create()
		.get(/\/.*/, ctx =>
			Oath.Resolve(ctx)
				.pipe(
					ops0.chain(ctx =>
						Oath.Resolve(performance.now()).pipe(
							ops0.chain(time =>
								Oath.Resolve(new URL(ctx.req.url))
									.pipe(ops0.map(extract_pathname_from_url))
									.pipe(ops0.map(create_full_file_path(root)))
									.pipe(ops0.chain(open_file_if_exists))
									.pipe(
										ops0.bimap(
											create_error_middleware_context(time),
											create_middleware_context(time),
										),
									)
									.pipe(ops0.bitap(set_error_body(ctx), set_response_body(ctx)))
									.fix(x => x),
							),
						),
					),
				)
				.pipe(ops0.tap(set_response_time_header(ctx)))
				.pipe(ops0.tap(log_request_thunk(logger, serverName, ctx))),
		)
		.or_else(ctx => {
			console.log(ctx.req.url)
		})

// --- Internal ---

const extract_pathname_from_url = ({ pathname }: URL) => pathname

const create_middleware_context = (time: number) => (file: BunFile) =>
	({ file, time }) as StaticMiddlewareState

const create_error_middleware_context = (time: number) => () => ({ time }) as StaticMiddlewareState

const create_full_file_path = (root: string) => (pathname: string) => join(root, pathname)

const log_request_thunk = (logger: TLogger, serverName: string, ctx: Context) => () =>
	log_bun_request({ logger, server_name: serverName })(ctx)

const open_file_if_exists = (path: string) =>
	file_exists0(path).pipe(ops0.chain(exists => Oath.If(exists, { T: () => Bun.file(path) })))

const set_response_time_header =
	(ctx: Context) =>
	({ time }: StaticMiddlewareState) =>
		ctx.res.setHeader("x-response-time", `${Math.ceil(performance.now() - time)}`)

const set_response_body =
	(ctx: Context) =>
	({ file }: StaticMiddlewareState) => {
		ctx.res.setHeader("Access-Control-Allow-Origin", "*")
		ctx.res.setBody(file)
		ctx.res.setStatus(200)
		ctx.res.setHeader("content-type", file.type)
	}

const set_error_body = (ctx: Context) => () => {
	ctx.res.setHeader("Access-Control-Allow-Origin", "*")
	ctx.res.setStatus(404)
	ctx.res.setHeader("content-type", "application/json")
	ctx.res.setBody(JSON.stringify({ success: false, message: "Not found" }))
}
