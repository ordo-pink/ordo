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
import { type TDTChamber, create_backend_dt } from "@ordo-pink/backend-dt"
import { PersistenceStrategyDataFS } from "@ordo-pink/backend-persistence-strategy-data-fs"
import { is_port } from "@ordo-pink/tau"

const env_rrr = (env_var: string) => (value?: any) =>
	value != null ? `Invalid value for ${env_var}: "${value}"` : `Missing value for ${env_var}`

const get_env = () =>
	Oath.Merge({
		port: Oath.FromNullable(Bun.env.ORDO_DT_PORT)
			.and(n => Oath.If(is_port(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_DT_PORT"))),

		allow_origin: Oath.FromNullable(Bun.env.ORDO_DT_ALLOW_ORIGIN)
			.and(s => s.split(", "))
			.pipe(ops0.rejected_map(env_rrr("ORDO_DT_ALLOW_ORIGIN"))),

		data_path: Oath.FromNullable(Bun.env.ORDO_DT_DATA_PATH, env_rrr("ORDO_DT_DATA_PATH")),

		id_host: Oath.FromNullable(Bun.env.ORDO_ID_HOST, env_rrr("ORDO_ID_HOST")),

		dt_host: Oath.FromNullable(Bun.env.ORDO_DT_HOST, env_rrr("ORDO_DT_HOST")),
	})

const main = () =>
	get_env()
		.and(({ allow_origin, port, data_path, id_host, dt_host }) =>
			Oath.Merge({
				allow_origin,
				logger,
				data_persistence_strategy: PersistenceStrategyDataFS.Of(data_path),
				id_host,
				dt_host,
			} satisfies TDTChamber)
				.and(create_backend_dt)
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
	alert: (...message) => ConsoleLogger.alert("[DT]", ...message),
	crit: (...message) => ConsoleLogger.crit("[DT]", ...message),
	debug: (...message) => ConsoleLogger.debug("[DT]", ...message),
	error: (...message) => ConsoleLogger.error("[DT]", ...message),
	info: (...message) => ConsoleLogger.info("[DT]", ...message),
	notice: (...message) => ConsoleLogger.notice("[DT]", ...message),
	panic: (...message) => ConsoleLogger.panic("[DT]", ...message),
	warn: (...message) => ConsoleLogger.warn("[DT]", ...message),
}
