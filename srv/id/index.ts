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

import { CORE, type Core, core } from "@ordo-pink/sdk-core"
import { type Server, server } from "@ordo-pink/sdk-server"
import type { Routary } from "@ordo-pink/oss-routary"
import type { ServerRoutary } from "@ordo-pink/sdk-server-routary"
import { codegen_strategy_bun } from "@ordo-pink/b-strategy-codegen-bun"
import { data_repository_fs } from "@ordo-pink/b-repository-data-fs"
import { oath } from "@ordo-pink/oss-oath"
import { result } from "@ordo-pink/oss-result"
import { rickroll } from "@ordo-pink/oss-rickroll"
import { server_id } from "@ordo-pink/b-server-id"
import { user_repository_data } from "@ordo-pink/b-repository-user-repository-data"
import { wjwt as wjwt_lib } from "@ordo-pink/oss-wjwt"

const main = async () => {
	const codegen_algorithm = await codegen_algorithm0.cata(oath.catas.to_promise())
	const wjwt_alg = await wjwt_algorithm0.cata(oath.catas.to_promise())
	const priv = await private_key0.cata(oath.catas.to_promise())
	const pub = await public_key0.cata(oath.catas.to_promise())

	// TODO Real email strategy
	const email_strategy: Server.Email.Strategy = { send: (_, __, content) => Promise.resolve(logger.debug(content)) }
	const data_repository = data_repository_fs.create(data_root)
	const user_repository = user_repository_data.create(data_repository, cache_user_id, cache_file_id, user_file_id)
	const codegen_strategy = codegen_strategy_bun.create(codegen_algorithm)
	const wjwt = wjwt_lib.create(wjwt_alg, priv, pub, allowed_origins, "http://localhost:3001", session_lifetime_minutes)

	const fetch = server_id
		.create(
			logger,
			user_repository,
			code_lifetime_seconds,
			session_lifetime_minutes,
			email_strategy,
			allowed_origins,
			codegen_strategy,
			wjwt,
		)
		.or_else(() => rickroll, catcher)

	const bun_server = Bun.serve({ fetch, port })

	logger.info(`Server started on ${bun_server.url.toString()}`)
}

// --- Internal ---

const logger: Core.Logger = {
	alert: (...message) => core.logger.stout.alert("[ID]", ...message),
	crit: (...message) => core.logger.stout.crit("[ID]", ...message),
	debug: (...message) => core.logger.stout.debug("[ID]", ...message),
	error: (...message) => core.logger.stout.error("[ID]", ...message),
	info: (...message) => core.logger.stout.info("[ID]", ...message),
	notice: (...message) => core.logger.stout.notice("[ID]", ...message),
	panic: (...message) => core.logger.stout.panic("[ID]", ...message),
	warn: (...message) => core.logger.stout.warn("[ID]", ...message),
}

const get_alg = () => oath.from_nullable(Bun.env.ORDO_ID_SESSION_TOKEN_ALGORITHM)

// TODO Clean up, add checks
const private_key0 = oath
	.from_nullable(Bun.env.ORDO_ID_SESSION_TOKEN_PRIVATE_KEY)
	.pipe(oath.ops.chain(key => get_alg().pipe(oath.ops.map(alg => [alg, key]))))
	.pipe(
		oath.ops.chain(([alg, str]) =>
			oath.from_promise(() => crypto.subtle.importKey("jwk", JSON.parse(str), alg as any, true, ["sign"])),
		),
	)

// TODO Clean up, add checks
const public_key0 = oath
	.from_nullable(Bun.env.ORDO_ID_SESSION_TOKEN_PUBLIC_KEY)
	.pipe(oath.ops.chain(key => get_alg().pipe(oath.ops.map(alg => [alg, key]))))
	.pipe(
		oath.ops.chain(([alg, str]) =>
			oath.from_promise(() => crypto.subtle.importKey("jwk", JSON.parse(str), alg as any, true, ["verify"])),
		),
	)

const allowed_origins = result
	.from_nullable(Bun.env.ORDO_ID_ALLOW_ORIGIN)
	.pipe(result.ops.map(str => str.split(", ")))
	.cata(result.catas.or_else(() => "http://localhost:3000"))

const port = result
	.from_nullable(Bun.env.ORDO_ID_PORT)
	.pipe(result.ops.chain(port => result.if(server.is_port(port), { on_true: () => port })))
	.cata(result.catas.or_else(() => "3001"))

const data_root = result.from_nullable(Bun.env.ORDO_ID_DATA_ROOT).cata(result.catas.or_else(() => "var/dt1"))

const user_file_id = result
	.from_nullable(Bun.env.ORDO_USER_FILE_ID)
	.pipe(result.ops.chain(id => result.if(core.uuid.guard(id), { on_true: () => id as Core.Uuid.Instance })))
	.cata(result.catas.or_else(() => CORE.UUID.FIRSTBORN as Core.Uuid.Instance))

const cache_user_id = result
	.from_nullable(Bun.env.ORDO_ID_CACHE_USER_ID)
	.pipe(result.ops.chain(id => result.if(core.uuid.guard(id), { on_true: () => id as Core.Uuid.Instance })))
	.cata(result.catas.or_else(() => CORE.UUID.FIRSTBORN as Core.Uuid.Instance))

const cache_file_id = result
	.from_nullable(Bun.env.ORDO_ID_CACHE_FILE_ID)
	.pipe(result.ops.chain(id => result.if(core.uuid.guard(id), { on_true: () => id as Core.Uuid.Instance })))
	.cata(result.catas.or_else(() => CORE.UUID.THE_LAST_ONE as Core.Uuid.Instance))

const codegen_algorithm0 = oath.from_nullable(Bun.env.ORDO_ID_CODE_ALGORITHM).pipe(
	oath.ops.chain(algorithm =>
		oath
			.from_nullable(Bun.env.ORDO_ID_CODE_ALGORITHM_PARAMS)
			.pipe(oath.ops.chain(str => oath.try(() => JSON.parse(str))))
			.pipe(oath.ops.fix(() => ({})))
			.pipe(oath.ops.map(params => ({ algorithm, ...params }))),
	),
)

const code_lifetime_seconds = result
	.from_nullable(Bun.env.ORDO_ID_CODE_LIFETIME_SECONDS)
	.pipe(result.ops.map(str => Number.parseInt(str, 10)))
	.pipe(result.ops.chain(n => result.if(core.fns.is_non_negative_integer(n), { on_true: () => n })))
	.cata(result.catas.or_else(() => 60 * 5))

const session_lifetime_minutes = result
	.from_nullable(Bun.env.ORDO_ID_SESSION_LIFETIME_MINUTES)
	.pipe(result.ops.map(str => Number.parseInt(str, 10)))
	.pipe(result.ops.chain(n => result.if(core.fns.is_non_negative_integer(n), { on_true: () => n })))
	.cata(result.catas.or_else(() => 60 * 24 * 30))

const wjwt_algorithm0 = oath.from_nullable(Bun.env.ORDO_ID_SESSION_TOKEN_ALGORITHM).pipe(
	oath.ops.chain(name =>
		oath
			.from_nullable(Bun.env.ORDO_ID_SESSION_TOKEN_ALGORITHM_PARAMS)
			.pipe(oath.ops.chain(str => oath.try(() => JSON.parse(str))))
			.pipe(oath.ops.fix(() => ({})))
			.pipe(oath.ops.map(params => ({ name, ...params }))),
	),
)

const catcher: Routary.Catcher<ServerRoutary.ArgsEnv, ServerRoutary.Mut> = ({ env, request, error }) => {
	const pathname = new URL(request.url).pathname
	env.logger.error(`UNEXPECTED ERROR (${pathname}):`, error)
	return new Response("", { status: 500 })
}

main().catch(console.error)
