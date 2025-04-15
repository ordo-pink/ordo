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

import * as tau from "@ordo-pink/tau"
import { BackendAuth, create_backend_server_au } from "@ordo-pink/backend-server-au"
import { type Logger, console_logger } from "@ordo-pink/logger"
import { create_persistence_strategy_user, create_reference_mapping_user } from "@ordo-pink/backend-persistence-strategy-user"
import { create_persistence_strategy_data_fs } from "@ordo-pink/backend-persistence-strategy-data-fs"
import { oath } from "@ordo-pink/oath"
import { rrr } from "@ordo-pink/core"

const env_rrr = (env_var: string) => (value?: any) =>
	value != null ? `Invalid value for ${env_var}: "${value}"` : `Missing value for ${env_var}`

const get_env = () =>
	oath.merge({
		port: oath
			.from_nullable(Bun.env.ORDO_AU_PORT)
			.pipe(oath.ops.and(n => oath.if(tau.is_port(n), { on_true: () => n })))
			.pipe(oath.ops.rmap(env_rrr("ORDO_AU_PORT"))),

		data_root: oath.from_nullable(Bun.env.ORDO_DT_DATA_PATH, env_rrr("ORDO_DT_DATA_PATH")),

		file_limit: oath
			.from_nullable(Bun.env.ORDO_AU_DEFAULT_FILE_LIMIT)
			.pipe(oath.ops.and(s => Number.parseInt(s, 10)))
			.pipe(oath.ops.and(n => oath.if(tau.is_finite_positive_int(n), { on_true: () => n })))
			.pipe(oath.ops.rmap(env_rrr("ORDO_AU_DEFAULT_FILE_LIMIT"))),

		max_upload_size: oath
			.from_nullable(Bun.env.ORDO_AU_DEFAULT_MAX_UPLOAD_SIZE)
			.pipe(oath.ops.and(s => Number.parseFloat(s)))
			.pipe(oath.ops.and(n => oath.if(tau.is_positive_number(n), { on_true: () => n })))
			.pipe(oath.ops.rmap(env_rrr("ORDO_AU_DEFAULT_MAX_UPLOAD_SIZE"))),

		max_functions: oath
			.from_nullable(Bun.env.ORDO_AU_DEFAULT_MAX_FUNCTIONS)
			.pipe(oath.ops.and(s => Number.parseInt(s, 10)))
			.pipe(oath.ops.and(n => oath.if(tau.is_finite_non_negative_int(n), { on_true: () => n })))
			.pipe(oath.ops.rmap(env_rrr("ORDO_AU_DEFAULT_MAX_FUNCTIONS"))),

		allow_origin: oath
			.from_nullable(Bun.env.ORDO_AU_ALLOW_ORIGIN)
			.pipe(oath.ops.and(s => s.split(", ")))
			.pipe(oath.ops.rmap(env_rrr("ORDO_AU_ALLOW_ORIGIN"))),

		session_lifetime_s: oath
			.from_nullable(Bun.env.ORDO_AU_SESSION_LIFETIME)
			.pipe(oath.ops.and(s => Number.parseInt(s, 10)))
			.pipe(oath.ops.and(n => oath.if(tau.is_finite_positive_int(n), { on_true: () => n })))
			.pipe(oath.ops.rmap(env_rrr("ORDO_AU_SESSION_LIFETIME"))),

		code_lifetime_ms: oath
			.from_nullable(Bun.env.ORDO_AU_CODE_LIFETIME_MS)
			.pipe(oath.ops.and(s => Number.parseInt(s, 10)))
			.pipe(oath.ops.and(n => oath.if(tau.is_finite_positive_int(n), { on_true: () => n })))
			.pipe(oath.ops.rmap(env_rrr("ORDO_AU_CODE_LIFETIME_MS"))),

		web_host: oath.from_nullable(Bun.env.ORDO_WEB_HOST, env_rrr("ORDO_WEB_HOST")),
	})

const main = () =>
	get_env()
		.pipe(
			oath.ops.and(
				({
					allow_origin,
					code_lifetime_ms,
					data_root,
					port,
					max_functions,
					max_upload_size,
					file_limit,
					session_lifetime_s,
				}) => {
					const persistence_strategy_data = create_persistence_strategy_data_fs({ root: data_root })
					const persistence_strategy_user = create_persistence_strategy_user(persistence_strategy_data)
					const reference_mapping_user = create_reference_mapping_user(persistence_strategy_data, persistence_strategy_user)

					return oath
						.merge({
							allow_origin,
							logger,
							defaults: { file_limit, max_functions, max_upload_size },
							email_strategy: { send: ({ content }) => logger.notice("NOTIFICATION:", "::", content) }, // TODO
							// session_lifetime,
							persistence_strategy_user,
							auth_storage: new Map(),
							code_strategy: {
								generate: () =>
									oath
										.of(new Uint8Array(6))
										.pipe(oath.ops.map(ua => crypto.getRandomValues(ua)))
										.pipe(oath.ops.and(num_array => num_array.join("")))
										.pipe(oath.ops.and(num_string => num_string.slice(0, 6))),
								hash: code =>
									oath
										.from_promise(() => Bun.password.hash(code, { algorithm: "bcrypt", cost: 4 }))
										.pipe(oath.ops.rmap(error => rrr.codes.eio("Failed to hash code", error))),
								verify: (hash, code) =>
									oath
										.from_promise(() => Bun.password.verify(code, hash))
										.pipe(oath.ops.rmap(error => rrr.codes.eio("Failed to verify code", error))),
							},
							create_request_id: () => crypto.randomUUID(),
							data_persistence_strategy: null as any,
							port: Number(port),
							code_lifetime_ms,
							session_lifetime_s,
							reference_mapping_user,
							// web_host,
						} satisfies BackendAuth.Params)
						.pipe(oath.ops.and(create_backend_server_au))
						.pipe(oath.ops.and(fetch => Bun.serve({ fetch, port })))
				},
			),
		)
		.pipe(oath.ops.tap(server => logger.info(`server running on http://${server.hostname}:${server.port}`)))
		.cata(
			oath.catas.or_else(e => {
				logger.panic(e)
				process.exit(1)
			}),
		)

// --- Internal ---

const logger: Logger = {
	alert: (...message) => console_logger.alert("[AU]", ...message),
	crit: (...message) => console_logger.crit("[AU]", ...message),
	debug: (...message) => console_logger.debug("[AU]", ...message),
	error: (...message) => console_logger.error("[AU]", ...message),
	info: (...message) => console_logger.info("[AU]", ...message),
	notice: (...message) => console_logger.notice("[AU]", ...message),
	panic: (...message) => console_logger.panic("[AU]", ...message),
	warn: (...message) => console_logger.warn("[AU]", ...message),
}

void main()
