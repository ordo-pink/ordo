/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { CORE, type Core, core } from "@ordo-pink/sdk-core"
import { curry } from "@ordo-pink/oss-curry"
import { oath } from "@ordo-pink/oss-oath"
import { routary } from "@ordo-pink/oss-routary"
import { sweech } from "@ordo-pink/oss-sweech"

import type * as Lib from "./sdk-server-routary.types"
import * as log from "./log/log.impl"
import * as request_id from "./request-id/request-id.impl"
import * as request_ip from "./request-ip/request-ip.impl"
import * as request_lang from "./request-lang/request-lang.impl"
import * as response_timer from "./response-timer/response-timer.impl"

export const create: Lib.Create = (env, mut) =>
	routary
		.create({ ...env, fail: fail(env.logger) }, mut)
		.pipe(routary.ops.before_each(request_id.set))
		.pipe(routary.ops.before_each(request_lang.set))
		.pipe(routary.ops.before_each(request_ip.set))
		.pipe(routary.ops.before_each(response_timer.start))
		.pipe(routary.ops.after_each(response_timer.end))
		.pipe(routary.ops.after_each(log.request))
		.pipe(routary.ops.get("/healthcheck", () => new Response("OK")))

export const fail = (logger: Core.Logger) => (rrr: Core.Rrr.Instance) => {
	const headers = new Headers()
	const status = sweech
		.match(rrr.type)
		.case([CORE.RRR.TYPE.EAGAIN, CORE.RRR.TYPE.ENXIO], () => 408)
		.case([CORE.RRR.TYPE.EFBIG, CORE.RRR.TYPE.ENOSPC], () => 413)
		.case(CORE.RRR.TYPE.EINVAL, () => 400)
		.case(CORE.RRR.TYPE.EACCES, () => 401)
		.case(CORE.RRR.TYPE.EPERM, () => 403)
		.case(CORE.RRR.TYPE.ENOENT, () => 404)
		.case(CORE.RRR.TYPE.EEXIST, () => 409)
		.default(() => 500)

	if (rrr.debug) logger.debug(CORE.RRR.TYPE[rrr.type], rrr.debug)
	if (rrr.message) headers.set("X-Reason", String(rrr.message))

	return new Response("", { status, headers })
}

// TODO Clean up

export namespace oaths {
	export const to_json = (x: any) =>
		oath.try(() => JSON.stringify(x)).pipe(oath.ops.rmap(e => core.rrr.eio(CORE.RRR.REASON.JSON_STRINGIFY_FAILED, e)))

	export const get_cookie = (request: Bun.BunRequest, name: string) =>
		oath
			.from_nullable(request.cookies, () => core.rrr.einval(CORE.RRR.REASON.MISSING_REQUIRED_COOKIE, name))
			.pipe(oath.ops.chain(c => oath.from_nullable(c.get(name))))
			.pipe(oath.ops.rmap(() => core.rrr.einval(CORE.RRR.REASON.MISSING_REQUIRED_COOKIE, name)))

	export const get_json_body = (request: Bun.BunRequest) =>
		oath
			.from_promise(() => request.json())
			.pipe(oath.ops.rmap(() => core.rrr.einval(CORE.RRR.REASON.JSON_PARSE_FAILED, void 0)))
}

export const set_response_header = curry((key: string, value: string, r: Response) => r.headers.set(key, value))
