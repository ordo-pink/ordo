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

import { type TZags, zags } from "@ordo-pink/zags"
import { R } from "@ordo-pink/result"
import { call_once } from "@ordo-pink/tau"
import { rrr } from "@ordo-pink/core"

import { ordo_app_state } from "../app.state"

type TF = () => {
	get_file_associations: (fid: symbol) => TZags<{ value: Ordo.FileAssociation.Instance[] }>
}
export const init_functions: TF = call_once(() => {
	const { logger, commands, known_functions } = ordo_app_state.zags.unwrap()

	commands.on(
		"cmd.functions.file_associations.register",
		assoc =>
			void R.If(!ordo_app_state.zags.select("functions.file_assocs").some(f => f.name === assoc.name))
				.pipe(R.ops.err_map(log_rrr_exists(assoc.name)))
				.pipe(R.ops.map(() => ordo_app_state.zags.update("functions.file_assocs", as => as.concat(assoc)))),
	)

	commands.on(
		"cmd.functions.file_associations.unregister",
		name =>
			void R.FromNullable(ordo_app_state.zags.select("functions.file_assocs").find(a => a.name === name))
				.pipe(R.ops.err_map(log_rrr_enoent(name)))
				.pipe(R.ops.map(() => ordo_app_state.zags.update("functions.file_assocs", as => as.filter(a => a.name !== name)))),
	)

	commands.on(
		"cmd.functions.activities.register",
		activity =>
			void R.If(!ordo_app_state.zags.select("functions.activities").some(a => a.name === activity.name))
				.pipe(R.ops.err_map(log_rrr_exists(activity.name)))
				.pipe(R.ops.map(() => ordo_app_state.zags.update("functions.activities", as => as.concat(activity)))),
	)

	commands.on(
		"cmd.functions.activities.unregister",
		name =>
			void R.FromNullable(ordo_app_state.zags.select("functions.activities").find(a => a.name === name))
				.pipe(R.ops.err_map(log_rrr_enoent(name)))
				.pipe(R.ops.map(() => ordo_app_state.zags.update("functions.activities", as => as.filter(a => a.name !== name)))),
	)

	logger.debug("🟢 Initialised activities.")

	return {
		get_file_associations: fid =>
			R.If(known_functions.has_permissions(fid, { queries: ["application.file_associations"] }))
				.pipe(
					R.ops.map(() => {
						const zags = zags.Of({ value: [] as Ordo.FileAssociation.Instance[] })
						ordo_app_state.zags.cheat("functions.file_assocs", state => zags.update("value", () => state))
						return zags
					}),
				)
				.cata(
					R.catas.or_else(
						() =>
							"File associations permission RRR. Did you forget to request query permission 'application.file_associations'?" as never,
					),
				),
	}
})

// --- Internal ---

type TLogAlreadyExistsFn = (name: string) => () => Ordo.Rrr<"EEXIST">
const log_rrr_exists: TLogAlreadyExistsFn = name => () => rrr.codes.eexist(`Activity "${name}" already registered`)

type TLogActivityNotFoundFn = (name: string) => () => Ordo.Rrr<"ENOENT">
const log_rrr_enoent: TLogActivityNotFoundFn = name => () => rrr.codes.enoent(`Activity with name "${name}" is not registerred`)
