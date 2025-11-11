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

import type { Wjwt } from "@ordo-pink/oss-wjwt"
import { curry } from "@ordo-pink/oss-curry"
import { oath } from "@ordo-pink/oss-oath"
import { routary } from "@ordo-pink/oss-routary"
import { sweech } from "@ordo-pink/oss-sweech"

import type * as ServerRoutary from "./sdk-server-routary.types"
import * as log from "./log/log.impl"
import * as request_id from "./request-id/request-id.impl"
import * as request_ip from "./request-ip/request-ip.impl"
import * as response_timer from "./response-timer/response-timer.impl"

export const create: ServerRoutary.Create = (env, mut) =>
	routary
		.create({ ...env, fail: fail(env.logger) }, mut)
		.pipe(routary.ops.before_each(request_id.set))
		.pipe(routary.ops.before_each(request_ip.set))
		.pipe(routary.ops.before_each(response_timer.start))
		.pipe(routary.ops.after_each(response_timer.end))
		.pipe(routary.ops.after_each(log.request))
		.pipe(routary.ops.get("/healthcheck", () => new Response("OK")))

export const fail = (logger: Ordo.Logger) => (rrr: Ordo.Rrr.Instance, headers?: Headers) => {
	if (!headers) headers = new Headers()

	const status = sweech
		.match(rrr?.type)
		.case([ORDO.RRR.TYPE.EAGAIN, ORDO.RRR.TYPE.ENXIO], () => 408)
		.case([ORDO.RRR.TYPE.EFBIG, ORDO.RRR.TYPE.ENOSPC], () => 413)
		.case(ORDO.RRR.TYPE.EINVAL, () => 400)
		.case(ORDO.RRR.TYPE.EACCES, () => 401)
		.case(ORDO.RRR.TYPE.EPERM, () => 403)
		.case(ORDO.RRR.TYPE.ENOENT, () => 404)
		.case(ORDO.RRR.TYPE.EEXIST, () => 409)
		.default(() => 500)

	if (rrr?.debug) logger.debug(ORDO.RRR.TYPE[rrr.type], rrr.debug)
	if (rrr?.message) headers.set("X-Reason", String(rrr.message))

	return new Response("", { status, headers })
}

// TODO Clean up

export namespace oaths {
	export const to_json = (x: any) =>
		oath.try_catch(() => JSON.stringify(x)).pipe(oath.ops.rmap(ordo.rrr.eio(ORDO.RRR.REASON.JSON_STRINGIFY_FAILED)))

	export const get_json_body = (request: Request) =>
		oath.from_promise(() => request.json()).pipe(oath.ops.rmap(ordo.rrr.einval(ORDO.RRR.REASON.JSON_PARSE_FAILED)))
}

export const set_response_header = curry((key: string, value: string, response: Response) => response.headers.set(key, value))

export const create_alg = (alg_name?: string, alg_params?: string) =>
	oath.merge({ name: oath.from_nullable(alg_name), params: oath.from_nullable(alg_params).pipe(oath.ops.chain(oaths.to_json)) })
