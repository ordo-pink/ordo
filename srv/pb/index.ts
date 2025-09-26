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

import { Core, core } from "@ordo-pink/sdk-core"
import { create_backend_server_pb } from "@ordo-pink/_backend-server-pb"
import { create_persistence_strategy_data_fs } from "@ordo-pink/b-repository-data-fs"
import { is_port } from "@ordo-pink/_tau"
import { oath } from "@ordo-pink/oss-oath"

const env_rrr = (env_var: string) => (value?: any) =>
	value != null ? `Invalid value for ${env_var}: "${value}"` : `Missing value for ${env_var}`

const get_env = () =>
	oath.merge({
		port: oath
			.from_nullable(Bun.env.ORDO_PB_PORT)
			.pipe(oath.ops.and(n => oath.if_else(is_port(n), { t: () => n })))
			.pipe(oath.ops.rmap(env_rrr("ORDO_PB_PORT"))),

		data_path: oath.from_nullable(Bun.env.ORDO_DT_DATA_PATH, env_rrr("ORDO_DT_DATA_PATH")),

		allow_origin: oath
			.from_nullable(Bun.env.ORDO_DT_ALLOW_ORIGIN)
			.pipe(oath.ops.and(s => s.split(", ")))
			.pipe(oath.ops.rmap(env_rrr("ORDO_DT_ALLOW_ORIGIN"))),

		id_host: oath.from_nullable(Bun.env.ORDO_ID_HOST, env_rrr("ORDO_ID_HOST")),
	})

const main = () =>
	get_env()
		.pipe(
			oath.ops.and(({ port, data_path, allow_origin, id_host }) =>
				oath
					.merge({
						logger,
						data_persistence_strategy: create_persistence_strategy_data_fs({ root: data_path }),
						allow_origin,
						id_host,
					})
					.pipe(oath.ops.and(create_backend_server_pb))
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

const logger: Core.Logger = {
	alert: (...message) => core.logger.stout.alert("[PB]", ...message),
	crit: (...message) => core.logger.stout.crit("[PB]", ...message),
	debug: (...message) => core.logger.stout.debug("[PB]", ...message),
	error: (...message) => core.logger.stout.error("[PB]", ...message),
	info: (...message) => core.logger.stout.info("[PB]", ...message),
	notice: (...message) => core.logger.stout.notice("[PB]", ...message),
	panic: (...message) => core.logger.stout.panic("[PB]", ...message),
	warn: (...message) => core.logger.stout.warn("[PB]", ...message),
}

void main()
