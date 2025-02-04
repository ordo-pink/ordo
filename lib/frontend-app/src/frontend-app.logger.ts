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

import { O } from "@ordo-pink/option"
import { type TLogger } from "@ordo-pink/logger"
import { call_once } from "@ordo-pink/tau"

import { ordo_app_state } from "../app.state"

type TF = (logger: TLogger) => { get_logger: (fid: symbol) => TLogger }
export const init_logger: TF = call_once(logger => {
	const { is_dev, app_fid } = ordo_app_state.zags.select("constants")
	const known_functions = ordo_app_state.zags.select("known_functions")

	const get_logger = (fid: symbol): TLogger => {
		// TODO Fix option cata
		const known_function = known_functions.exchange(fid).cata(O.catas.or_else(() => "unauthorised")) as string
		const prefix = `@${known_function} ::`

		return {
			panic: (...message) => logger.panic(prefix, ...(message as any)),
			alert: (...message) => logger.alert(prefix, ...(message as any)),
			crit: (...message) => logger.crit(prefix, ...(message as any)),
			error: (...message) => logger.error(prefix, ...(message as any)),
			warn: (...message) => logger.warn(prefix, ...(message as any)),
			notice: (...message) => logger.notice(prefix, ...(message as any)),
			info: (...message) => logger.info(prefix, ...(message as any)),
			debug: (...message) => (is_dev ? logger.debug(prefix, ...(message as any)) : void 0),
		}
	}

	const app_logger = get_logger(app_fid)
	ordo_app_state.zags.update("logger", () => app_logger)

	return { get_logger }
})
