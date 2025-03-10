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

import { ConsoleLogger, type TLogger } from "@ordo-pink/logger"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { type TIDChamber, create_backend_id } from "@ordo-pink/backend-id"
import { is_finite_non_negative_int, is_finite_positive_int, is_port, is_positive_number } from "@ordo-pink/tau"
import { PersistenceStategyUserFS } from "@ordo-pink/backend-persistence-strategy-user-fs"

const env_rrr = (env_var: string) => (value?: any) =>
	value != null ? `Invalid value for ${env_var}: "${value}"` : `Missing value for ${env_var}`

const get_env = () =>
	Oath.Merge({
		port: Oath.FromNullable(Bun.env.ORDO_ID_PORT)
			.and(n => Oath.If(is_port(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_ID_PORT"))),

		allow_origin: Oath.FromNullable(Bun.env.ORDO_ID_ALLOW_ORIGIN)
			.and(s => s.split(", "))
			.pipe(ops0.rejected_map(env_rrr("ORDO_ID_ALLOW_ORIGIN"))),

		file_limit: Oath.FromNullable(Bun.env.ORDO_ID_DEFAULT_FILE_LIMIT)
			.and(s => Number.parseInt(s, 10))
			.and(n => Oath.If(is_finite_positive_int(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_ID_DEFAULT_FILE_LIMIT"))),

		max_upload_size: Oath.FromNullable(Bun.env.ORDO_ID_DEFAULT_MAX_UPLOAD_SIZE)
			.and(s => Number.parseFloat(s))
			.and(n => Oath.If(is_positive_number(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_ID_DEFAULT_MAX_UPLOAD_SIZE"))),

		max_functions: Oath.FromNullable(Bun.env.ORDO_ID_DEFAULT_MAX_FUNCTIONS)
			.and(s => Number.parseInt(s, 10))
			.and(n => Oath.If(is_finite_non_negative_int(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_ID_DEFAULT_MAX_FUNCTIONS"))),

		session_lifetime: Oath.FromNullable(Bun.env.ORDO_ID_SESSION_LIFETIME)
			.and(s => Number.parseInt(s, 10))
			.and(n => Oath.If(is_finite_positive_int(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_ID_SESSION_LIFETIME"))),

		user_db_path: Oath.FromNullable(Bun.env.ORDO_ID_USER_DB_PATH, env_rrr("ORDO_ID_USER_DB_PATH")),
		web_host: Oath.FromNullable(Bun.env.ORDO_WEB_HOST, env_rrr("ORDO_WEB_HOST")),
		dt_host: Oath.FromNullable(Bun.env.ORDO_DT_HOST, env_rrr("ORDO_DT_HOST")),
	})

const main = () =>
	get_env()
		.and(({ allow_origin, file_limit, max_functions, max_upload_size, session_lifetime, port, user_db_path, web_host }) =>
			Oath.Merge({
				allow_origin,
				defaults: { file_limit, max_functions, max_upload_size },
				logger,
				notification_strategy: { send: ({ content }) => logger.notice("NOTIFICATION:", "::", content) }, // TODO
				session_lifetime,
				user_persistence_strategy: PersistenceStategyUserFS.Of(user_db_path),
				web_host,
			} satisfies TIDChamber)
				.and(create_backend_id)
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

const logger: TLogger = {
	alert: (...message) => ConsoleLogger.alert("[ID]", ...message),
	crit: (...message) => ConsoleLogger.crit("[ID]", ...message),
	debug: (...message) => ConsoleLogger.debug("[ID]", ...message),
	error: (...message) => ConsoleLogger.error("[ID]", ...message),
	info: (...message) => ConsoleLogger.info("[ID]", ...message),
	notice: (...message) => ConsoleLogger.notice("[ID]", ...message),
	panic: (...message) => ConsoleLogger.panic("[ID]", ...message),
	warn: (...message) => ConsoleLogger.warn("[ID]", ...message),
}
