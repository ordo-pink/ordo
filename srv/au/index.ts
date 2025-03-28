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
import { BackendAuth, create_backend_auth } from "@ordo-pink/backend-au"
import { type Logger, console_logger } from "@ordo-pink/logger"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { PersistenceStrategyDataFS } from "@ordo-pink/backend-persistence-strategy-data-fs"

const env_rrr = (env_var: string) => (value?: any) =>
	value != null ? `Invalid value for ${env_var}: "${value}"` : `Missing value for ${env_var}`

const get_env = () =>
	Oath.Merge({
		port: Oath.FromNullable(Bun.env.ORDO_AU_PORT)
			.and(n => Oath.If(tau.is_port(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_AU_PORT"))),

		data_root: Oath.FromNullable(Bun.env.ORDO_DT_DATA_PATH, env_rrr("ORDO_DT_DATA_PATH")),

		file_limit: Oath.FromNullable(Bun.env.ORDO_AU_DEFAULT_FILE_LIMIT)
			.and(s => Number.parseInt(s, 10))
			.and(n => Oath.If(tau.is_finite_positive_int(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_AU_DEFAULT_FILE_LIMIT"))),

		max_upload_size: Oath.FromNullable(Bun.env.ORDO_AU_DEFAULT_MAX_UPLOAD_SIZE)
			.and(s => Number.parseFloat(s))
			.and(n => Oath.If(tau.is_positive_number(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_AU_DEFAULT_MAX_UPLOAD_SIZE"))),

		max_functions: Oath.FromNullable(Bun.env.ORDO_AU_DEFAULT_MAX_FUNCTIONS)
			.and(s => Number.parseInt(s, 10))
			.and(n => Oath.If(tau.is_finite_non_negative_int(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_AU_DEFAULT_MAX_FUNCTIONS"))),

		allow_origin: Oath.FromNullable(Bun.env.ORDO_AU_ALLOW_ORIGIN)
			.and(s => s.split(", "))
			.pipe(ops0.rejected_map(env_rrr("ORDO_AU_ALLOW_ORIGIN"))),

		session_lifetime: Oath.FromNullable(Bun.env.ORDO_AU_SESSION_LIFETIME)
			.and(s => Number.parseInt(s, 10))
			.and(n => Oath.If(tau.is_finite_positive_int(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_AU_SESSION_LIFETIME"))),

		code_lifetime_ms: Oath.FromNullable(Bun.env.ORDO_AU_CODE_LIFETIME_MS)
			.and(s => Number.parseInt(s, 10))
			.and(n => Oath.If(tau.is_finite_positive_int(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_AU_CODE_LIFETIME_MS"))),

		web_host: Oath.FromNullable(Bun.env.ORDO_WEB_HOST, env_rrr("ORDO_WEB_HOST")),
	})

const main = () =>
	get_env()
		.and(({ allow_origin, code_lifetime_ms, data_root, port, max_functions, max_upload_size, file_limit }) =>
			Oath.Merge({
				allow_origin,
				logger,
				defaults: { file_limit, max_functions, max_upload_size },
				email_strategy: { send: ({ content }) => logger.notice("NOTIFICATION:", "::", content) }, // TODO
				// session_lifetime,
				user_persistence_strategy: PersistenceStategyUser.Of(PersistenceStrategyDataFS.Of(data_root)),
				auth_storage: new Map(),
				code_strategy: {
					generate: () =>
						Oath.Resolve(new Uint8Array(6))
							.pipe(ops0.map(ua => crypto.getRandomValues(ua)))
							.and(num_array => num_array.join(""))
							.and(num_string => num_string.slice(0, 6)),
					hash: code =>
						Oath.Try(
							() => Bun.password.hash(code, { algorithm: "bcrypt", cost: 4 }),
							error => RRR.codes.eio("Failed to hash code", error),
						),
					verify: (hash, code) =>
						Oath.Try(
							() => Bun.password.verify(code, hash),
							error => RRR.codes.eio("Failed to verify code", error),
						),
				},
				create_request_id: () => crypto.randomUUID(),
				data_persistence_strategy: null as any,
				port: Number(port),
				code_lifetime_ms,
				// web_host,
			} satisfies BackendAuth.Chamber)
				.and(create_backend_auth)
				.and(fetch => Bun.serve({ fetch, port })),
		)

		.pipe(ops0.tap(server => logger.info(`server running on http://${server.hostname}:${server.port}`)))
		.invoke(
			invokers0.or_else(e => {
				logger.panic(e)
				process.exit(1)
			}),
		)

void main()

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
