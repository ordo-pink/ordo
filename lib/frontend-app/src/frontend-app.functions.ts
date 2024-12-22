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

import { type TZags, ZAGS } from "@ordo-pink/zags"
import { R } from "@ordo-pink/result"
import { RRR } from "@ordo-pink/core"
import { call_once } from "@ordo-pink/tau"

import { ordo_app_state } from "../app.state"

type TF = () => TZags<TFunctionsState>
export const init_functions: TF = call_once(() => {
	const { logger, commands, known_functions } = ordo_app_state.zags.unwrap()

	commands.on("cmd.functions.file_associations.add", assoc =>
		R.If(!functions$.select("file_assocs").some(f => f.name === assoc.name))
			.pipe(R.ops.err_map(log_rrr_exists(assoc.name)))
			.pipe(R.ops.map(() => functions$.update("file_assocs", as => as.concat(assoc)))),
	)

	commands.on("cmd.functions.file_associations.remove", name =>
		R.FromNullable(functions$.select("file_assocs").find(a => a.name === name))
			.pipe(R.ops.err_map(log_rrr_enoent(name)))
			.pipe(R.ops.map(() => functions$.update("file_assocs", as => as.filter(a => a.name !== name)))),
	)

	commands.on("cmd.functions.activities.register", ({ activity, fid }) =>
		R.If(!functions$.select("activities").some(a => a.name === activity.name), { T: () => fid })
			.pipe(R.ops.err_map(log_rrr_exists(activity.name)))
			.pipe(R.ops.map(fid => functions$.update("activities", as => as.concat({ ...activity, fid })))),
	)

	commands.on("cmd.functions.activities.unregister", ({ name, fid }) =>
		R.FromNullable(functions$.select("activities").find(a => a.name === name))
			.pipe(R.ops.err_map(log_rrr_enoent(name)))
			.pipe(R.ops.chain(a => R.If(a.fid === fid || known_functions.is_internal(fid), { F: _log_different_fid(fid) })))
			.pipe(R.ops.map(() => functions$.update("activities", as => as.filter(a => a.name !== name)))),
	)

	logger.debug("🟢 Initialised activities.")

	return functions$
})

// --- Internal ---

type TFunctionsState = {
	current_activity?: Ordo.Activity.Instance
	activities: OrdoInternal.TFIDAwareActivity[]
	current_file_assoc?: Ordo.FileAssociation.Instance
	file_assocs: Ordo.FileAssociation.Instance[]
}

const LOCATION = "init_functions"

const eperm = RRR.codes.eperm(LOCATION)
const eexist = RRR.codes.eexist(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)

type TLogAlreadyExistsFn = (name: string) => () => Ordo.Rrr<"EEXIST">
const log_rrr_exists: TLogAlreadyExistsFn = name => () => eexist(`Activity "${name}" already registered`)

type TLogDifferentFIDFn = (fid: symbol | null) => () => Ordo.Rrr<"EPERM">
const _log_different_fid: TLogDifferentFIDFn = fid => () => eperm(`Only the activity itself can unregister: ${String(fid)}`)

type TLogActivityNotFoundFn = (name: string) => () => Ordo.Rrr<"ENOENT">
const log_rrr_enoent: TLogActivityNotFoundFn = name => () => enoent(`Activity with name "${name}" is not registerred`)

const functions$ = ZAGS.Of<TFunctionsState>({ activities: [], file_assocs: [] })
