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

import { type Logger, console_logger } from "@ordo-pink/logger"
import { type TIDFuel, create_backend_server_id } from "@ordo-pink/backend-server-id"
import { create_persistence_strategy_user, create_reference_mapping_user } from "@ordo-pink/backend-persistence-strategy-user"
import { is_finite_non_negative_int, is_finite_positive_int, is_port, is_positive_number } from "@ordo-pink/tau"
import { create_persistence_strategy_data_fs } from "@ordo-pink/backend-persistence-strategy-data-fs"
import { oath } from "@ordo-pink/oath"

const env_rrr = (env_var: string) => (value?: any) =>
	value != null ? `Invalid value for ${env_var}: "${value}"` : `Missing value for ${env_var}`

const get_env = () =>
	oath.merge({
		port: oath
			.from_nullable(Bun.env.ORDO_ID_PORT)
			.pipe(oath.ops.and(n => oath.if(is_port(n), { on_true: () => n })))
			.pipe(oath.ops.rmap(env_rrr("ORDO_ID_PORT"))),

		data_root: oath.from_nullable(Bun.env.ORDO_DT_DATA_PATH, env_rrr("ORDO_DT_DATA_PATH")),

		allow_origin: oath
			.from_nullable(Bun.env.ORDO_ID_ALLOW_ORIGIN)
			.pipe(oath.ops.and(s => s.split(", ")))
			.pipe(oath.ops.rmap(env_rrr("ORDO_ID_ALLOW_ORIGIN"))),

		file_limit: oath
			.from_nullable(Bun.env.ORDO_ID_DEFAULT_FILE_LIMIT)
			.pipe(oath.ops.and(s => Number.parseInt(s, 10)))
			.pipe(oath.ops.and(n => oath.if(is_finite_positive_int(n), { on_true: () => n })))
			.pipe(oath.ops.rmap(env_rrr("ORDO_ID_DEFAULT_FILE_LIMIT"))),

		max_upload_size: oath
			.from_nullable(Bun.env.ORDO_ID_DEFAULT_MAX_UPLOAD_SIZE)
			.pipe(oath.ops.and(s => Number.parseFloat(s)))
			.pipe(oath.ops.and(n => oath.if(is_positive_number(n), { on_true: () => n })))
			.pipe(oath.ops.rmap(env_rrr("ORDO_ID_DEFAULT_MAX_UPLOAD_SIZE"))),

		max_functions: oath
			.from_nullable(Bun.env.ORDO_ID_DEFAULT_MAX_FUNCTIONS)
			.pipe(oath.ops.and(s => Number.parseInt(s, 10)))
			.pipe(oath.ops.and(n => oath.if(is_finite_non_negative_int(n), { on_true: () => n })))
			.pipe(oath.ops.rmap(env_rrr("ORDO_ID_DEFAULT_MAX_FUNCTIONS"))),

		session_lifetime: oath
			.from_nullable(Bun.env.ORDO_ID_SESSION_LIFETIME)
			.pipe(oath.ops.and(s => Number.parseInt(s, 10)))
			.pipe(oath.ops.and(n => oath.if(is_finite_positive_int(n), { on_true: () => n })))
			.pipe(oath.ops.rmap(env_rrr("ORDO_ID_SESSION_LIFETIME"))),

		web_host: oath.from_nullable(Bun.env.ORDO_WEB_HOST, env_rrr("ORDO_WEB_HOST")),
		dt_host: oath.from_nullable(Bun.env.ORDO_DT_HOST, env_rrr("ORDO_DT_HOST")),
	})

const main = () =>
	get_env()
		.pipe(
			oath.ops.and(
				({ allow_origin, data_root, file_limit, max_functions, max_upload_size, session_lifetime, port, web_host }) => {
					const persistence_strategy_data = create_persistence_strategy_data_fs({ root: data_root })
					const persistence_strategy_user = create_persistence_strategy_user(persistence_strategy_data)
					const reference_mapping_user = create_reference_mapping_user(persistence_strategy_data, persistence_strategy_user)

					return oath
						.merge({
							allow_origin,
							defaults: { file_limit, max_functions, max_upload_size },
							logger,
							notification_strategy: { send: ({ content }) => logger.notice("NOTIFICATION:", "::", content) }, // TODO
							session_lifetime_s: session_lifetime,
							web_host,
							reference_mapping_user,
							persistence_strategy_user,
						} satisfies TIDFuel)
						.pipe(oath.ops.and(create_backend_server_id))
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
	alert: (...message) => console_logger.alert("[ID]", ...message),
	crit: (...message) => console_logger.crit("[ID]", ...message),
	debug: (...message) => console_logger.debug("[ID]", ...message),
	error: (...message) => console_logger.error("[ID]", ...message),
	info: (...message) => console_logger.info("[ID]", ...message),
	notice: (...message) => console_logger.notice("[ID]", ...message),
	panic: (...message) => console_logger.panic("[ID]", ...message),
	warn: (...message) => console_logger.warn("[ID]", ...message),
}

void main()
