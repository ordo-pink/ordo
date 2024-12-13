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

import { TLogger } from "@ordo-pink/logger"
import { call_once } from "@ordo-pink/tau"

type TInitLoggerFn = (
	logger: TLogger,
	known_functions: OrdoInternal.KnownFunctions,
) => {
	get_logger: (fid: symbol) => Ordo.CreateFunction.GetLoggerFn
}
export const init_logger: TInitLoggerFn = call_once((logger, known_functions) => {
	logger.debug("🟢 Initialised logger.")

	return {
		get_logger: fid => () => {
			const f = known_functions.exchange(fid).cata({ Some: x => x, None: () => "unauthorized" })

			return {
				panic: (...message) => logger.panic(`@${f} ::`, ...message),
				alert: (...message) => logger.alert(`@${f} ::`, ...message),
				crit: (...message) => logger.crit(`@${f} ::`, ...message),
				error: (...message) => logger.error(`@${f} ::`, ...message),
				warn: (...message) => logger.warn(`@${f} ::`, ...message),
				notice: (...message) => logger.notice(`@${f} ::`, ...message),
				info: (...message) => logger.info(`@${f} ::`, ...message),
				debug: (...message) => logger.debug(`@${f} ::`, ...message),
			}
		},
	}
})
