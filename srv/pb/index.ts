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
import { PersistenceStrategyDataFS } from "@ordo-pink/backend-persistence-strategy-data-fs"
import { create_backend_pb } from "@ordo-pink/backend-pb"
import { is_port } from "@ordo-pink/tau"

const env_rrr = (env_var: string) => (value?: any) =>
	value != null ? `Invalid value for ${env_var}: "${value}"` : `Missing value for ${env_var}`

const get_env = () =>
	Oath.Merge({
		port: Oath.FromNullable(Bun.env.ORDO_PB_PORT)
			.and(n => Oath.If(is_port(n), { T: () => n }))
			.pipe(ops0.rejected_map(env_rrr("ORDO_PB_PORT"))),

		data_path: Oath.FromNullable(Bun.env.ORDO_DT_DATA_PATH, env_rrr("ORDO_DT_DATA_PATH")),

		allow_origin: Oath.FromNullable(Bun.env.ORDO_DT_ALLOW_ORIGIN)
			.and(s => s.split(", "))
			.pipe(ops0.rejected_map(env_rrr("ORDO_DT_ALLOW_ORIGIN"))),
	})

const main = () =>
	get_env()
		.and(({ port, data_path, allow_origin }) =>
			Oath.Merge({ logger, data_persistence_strategy: PersistenceStrategyDataFS.Of(data_path), allow_origin })
				.and(create_backend_pb)
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
	alert: (...message) => ConsoleLogger.alert("[PB]", ...message),
	crit: (...message) => ConsoleLogger.crit("[PB]", ...message),
	debug: (...message) => ConsoleLogger.debug("[PB]", ...message),
	error: (...message) => ConsoleLogger.error("[PB]", ...message),
	info: (...message) => ConsoleLogger.info("[PB]", ...message),
	notice: (...message) => ConsoleLogger.notice("[PB]", ...message),
	panic: (...message) => ConsoleLogger.panic("[PB]", ...message),
	warn: (...message) => ConsoleLogger.warn("[PB]", ...message),
}
