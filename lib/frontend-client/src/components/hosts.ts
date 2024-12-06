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

import { RRR } from "@ordo-pink/core"
import { Result } from "@ordo-pink/result"

import { type TInitCtx } from "../frontend-client.types"

type TInitHostsFn = (params: Pick<TInitCtx, "logger" | "hosts" | "known_functions">) => {
	get_hosts: (fid: symbol) => Ordo.CreateFunction.GetHostsFn
}
export const init_hosts: TInitHostsFn = ({ logger, hosts, known_functions }) => {
	logger.debug("🟢 Initialised hosts.")

	return {
		get_hosts: fid => () =>
			Result.If(known_functions.has_permissions(fid, { queries: ["application.hosts"] }))
				.pipe(Result.ops.err_map(() => eperm(`get_hosts -> fid: ${String(fid)}`)))
				.pipe(Result.ops.map(() => hosts)),
	}
}

const eperm = RRR.codes.eperm("init_hosts")
