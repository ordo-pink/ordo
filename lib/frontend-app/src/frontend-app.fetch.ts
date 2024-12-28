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

import { ConsoleLogger } from "@ordo-pink/logger"
import { R } from "@ordo-pink/result"
import { call_once } from "@ordo-pink/tau"

import { ordo_app_state } from "../app.state"

const fetch = window.fetch

type TF = () => { get_fetch: (fid: symbol) => Ordo.Fetch }
export const init_fetch: TF = call_once(() => {
	const { logger, known_functions } = ordo_app_state.zags.unwrap()

	window.fetch = undefined as any
	window.XMLHttpRequest = undefined as any

	logger.debug("🟢 Initialised fetch.")

	return {
		get_fetch: fid =>
			R.If(known_functions.has_permissions(fid, { queries: ["application.fetch"] }))
				.pipe(R.ops.map(() => fetch))
				.cata(R.catas.or_else(() => forbidden_fetch)),
	}
})

const forbidden_fetch = () => {
	ConsoleLogger.error("Fetch permission RRR. Did you forget to request query permission 'application.fetch'?")
	return Promise.reject("Permission Denied")
}
