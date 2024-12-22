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

import { R } from "@ordo-pink/result"
import { RRR } from "@ordo-pink/core"

import { ordo_app_state } from "../app.state"

type TF = (hosts: Ordo.Hosts) => {
	get_hosts: (fid: symbol) => Ordo.CreateFunction.GetHostsFn
}
export const init_hosts: TF = hosts => {
	const { logger, known_functions } = ordo_app_state.zags.unwrap()

	logger.debug("🟢 Initialised hosts.")

	return {
		get_hosts: fid => () =>
			R.If(known_functions.has_permissions(fid, { queries: ["application.hosts"] }))
				.pipe(R.ops.err_map(() => eperm("get_hosts -> fid", fid)))
				.pipe(R.ops.map(() => hosts)),
	}
}

const eperm = RRR.codes.eperm("init_hosts")
