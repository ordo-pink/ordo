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
import { TLogger } from "@ordo-pink/logger"
import { Oath } from "@ordo-pink/oath"
import { file_exists0 } from "@ordo-pink/fs"
import { log_bun_request } from "@ordo-pink/backend-utils"

import type { StaticMiddlewareState } from "./static.types"

type P = { root: string; logger: TLogger; serverName: string }
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

const logRequestThunk = (logger: TLogger, serverName: string, ctx: Context) => () =>
	log_bun_request({ logger, server_name: serverName })(ctx)

const openFileIfExists0 = (path: string) =>
	file_exists0(path).chain(Oath.ifElse(Boolean, { onTrue: () => Bun.file(path) }))

const setResponseTimeHeader =
	(ctx: Context) =>
	({ time }: Pick<StaticMiddlewareState, "time">) =>
		ctx.res.setHeader("x-response-time", `${Math.ceil(performance.now() - time)}`)

const setResponseBody =
	(ctx: Context) =>
	({ file }: Pick<StaticMiddlewareState, "file">) => {
		ctx.res.setHeader("Access-Control-Allow-Origin", "*")
		ctx.res.setBody(file)
		ctx.res.setStatus(200)
		ctx.res.setHeader("content-type", file.type)
	}

const setErrorBody = (ctx: Context) => () => {
	ctx.res.setHeader("Access-Control-Allow-Origin", "*")
	ctx.res.setStatus(404)
	ctx.res.setHeader("content-type", "application/json")
	ctx.res.setBody(JSON.stringify({ success: false, message: "Not found" }))
}
