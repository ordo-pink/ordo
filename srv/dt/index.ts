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

import { type Logger, loggers } from "@ordo-pink/sdk-core"
import { type ServerDT, create_backend_server_dt } from "@ordo-pink/backend-server-dt"
import { create_persistence_strategy_data_fs } from "@ordo-pink/backend-persistence-strategy-data-fs"
import { is_port } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"

const env_rrr = (env_var: string) => (value?: any) =>
	value != null ? `Invalid value for ${env_var}: "${value}"` : `Missing value for ${env_var}`

const get_env = () =>
	oath.merge({
		port: oath
			.from_nullable(Bun.env.ORDO_DT_PORT)
			.pipe(oath.ops.and(n => oath.if(is_port(n), { on_true: () => n })))
			.pipe(oath.ops.rmap(env_rrr("ORDO_DT_PORT"))),

		allow_origin: oath
			.from_nullable(Bun.env.ORDO_DT_ALLOW_ORIGIN)
			.pipe(oath.ops.and(s => s.split(", ")))
			.pipe(oath.ops.rmap(env_rrr("ORDO_DT_ALLOW_ORIGIN"))),

		data_path: oath.from_nullable(Bun.env.ORDO_DT_DATA_PATH, env_rrr("ORDO_DT_DATA_PATH")),

		id_host: oath.from_nullable(Bun.env.ORDO_ID_HOST, env_rrr("ORDO_ID_HOST")),

		dt_host: oath.from_nullable(Bun.env.ORDO_DT_HOST, env_rrr("ORDO_DT_HOST")),
	})

const main = () =>
	get_env()
		.pipe(
			oath.ops.and(({ allow_origin, port, data_path, id_host, dt_host }) =>
				oath
					.merge({
						allow_origin,
						logger,
						data_persistence_strategy: create_persistence_strategy_data_fs({ root: data_path }),
						id_host,
						dt_host,
					} satisfies ServerDT.Params)
					.pipe(oath.ops.and(create_backend_server_dt))
					.pipe(oath.ops.and(fetch => Bun.serve({ fetch, port }))),
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
	alert: (...message) => loggers.stdout.alert("[DT]", ...message),
	crit: (...message) => loggers.stdout.crit("[DT]", ...message),
	debug: (...message) => loggers.stdout.debug("[DT]", ...message),
	error: (...message) => loggers.stdout.error("[DT]", ...message),
	info: (...message) => loggers.stdout.info("[DT]", ...message),
	notice: (...message) => loggers.stdout.notice("[DT]", ...message),
	panic: (...message) => loggers.stdout.panic("[DT]", ...message),
	warn: (...message) => loggers.stdout.warn("[DT]", ...message),
}

void main()
