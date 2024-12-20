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

import { BehaviorSubject, Subject, map, merge, scan, shareReplay } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { call_once, omit } from "@ordo-pink/tau"
import { RRR } from "@ordo-pink/core"
import { Result } from "@ordo-pink/result"

import { type TInitCtx } from "../frontend-client.types"

type TInitActivitiesFn = (params: Pick<TInitCtx, "logger" | "commands" | "known_functions">) => {
	current_activity$: typeof current_activity$
	activities$: typeof activities$
	get_current_activity: (fid: symbol) => Ordo.CreateFunction.GetCurrentActivityFn
	set_current_activity: (fid: symbol) => Ordo.CreateFunction.SetCurrentActivityFn
}
export const init_activities: TInitActivitiesFn = call_once(({ logger, commands, known_functions }) => {
	logger.debug("🟡 Initialising activities...")

	aggregated_activities$.subscribe(value => activities$.next(value))

	commands.on("cmd.functions.activities.register", ({ activity, fid }) =>
		Result.If(!activities$.getValue().some(a => a.name === activity.name), {
			T: () => fid,
			F: _log_already_exists(activity.name),
		}).pipe(Result.ops.map(fid => add$.next({ ...activity, fid }))),
	)

	commands.on("cmd.functions.activities.unregister", ({ name, fid }) =>
		Result.FromNullable(
			activities$.getValue().find(activity => activity.name === name),
			_log_activity_not_found(name),
		)
			.pipe(
				Result.ops.chain(activity =>
					Result.If(activity.fid === fid || known_functions.is_internal(fid), {
						F: _log_different_fid(fid),
					}),
				),
			)
			.pipe(Result.ops.map(() => remove$.next(name))),
	)

	logger.debug("🟢 Initialised activities.")

	return {
		current_activity$,
		activities$,

		get_current_activity: fid => () =>
			Result.If(known_functions.has_permissions(fid, { queries: ["application.current_activity"] }))
				.pipe(Result.ops.err_map(_log_invalid_fid(fid, "get_current_activity")))
				.pipe(Result.ops.map(() => current_activity$.asObservable())),

		set_current_activity: fid => name =>
			Result.If(known_functions.is_internal(fid))
				.pipe(Result.ops.err_map(_log_invalid_fid(fid, "set_current_activity")))
				.pipe(
					Result.ops.chain(() =>
						Result.FromNullable(activities$.getValue().find(a => a.name === name)).pipe(
							Result.ops.err_map(_log_activity_not_found(name)),
						),
					),
				)
				.pipe(Result.ops.map(omit("fid")))
				.pipe(
					Result.ops.map(activity => {
						if (current_activity$.getValue().unwrap()?.name !== activity.name) current_activity$.next(O.Some(activity))
					}),
				),
	}
})

// --- Internal ---

const LOCATION = "Init activities"

const eperm = RRR.codes.eperm(LOCATION)
const eexist = RRR.codes.eexist(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)

type TLogInvalidFIDFn = (fid: symbol | null, fn: string) => () => Ordo.Rrr<"EPERM">
const _log_invalid_fid: TLogInvalidFIDFn = (fid, fn) => () => eperm(`${fn} -> fid: ${String(fid)}`)

type TLogAlreadyExistsFn = (name: string) => () => Ordo.Rrr<"EEXIST">
const _log_already_exists: TLogAlreadyExistsFn = name => () => eexist(`Activity "${name}" already registered`)

type TLogDifferentFIDFn = (fid: symbol | null) => () => Ordo.Rrr<"EPERM">
const _log_different_fid: TLogDifferentFIDFn = fid => () => eperm(`Only the activity itself can unregister: ${String(fid)}`)

type TLogActivityNotFoundFn = (name: string) => () => Ordo.Rrr<"ENOENT">
const _log_activity_not_found: TLogActivityNotFoundFn = name => () => enoent(`Activity with name "${name}" is not registerred`)

const add$ = new Subject<OrdoInternal.TFIDAwareActivity>()
const remove$ = new Subject<string>()

const add =
	(new_activity: OrdoInternal.TFIDAwareActivity) =>
	(state: OrdoInternal.TFIDAwareActivity[]): OrdoInternal.TFIDAwareActivity[] => [...state, new_activity]

const remove =
	(name: string) =>
	(state: OrdoInternal.TFIDAwareActivity[]): OrdoInternal.TFIDAwareActivity[] =>
		state.filter(activity => activity.name === name)

const current_activity$ = new BehaviorSubject<TOption<Ordo.Activity.Instance>>(O.None())
const activities$ = new BehaviorSubject<OrdoInternal.TFIDAwareActivity[]>([])

const aggregated_activities$ = merge(add$.pipe(map(add)), remove$.pipe(map(remove))).pipe(
	scan((acc, f) => f(acc), [] as OrdoInternal.TFIDAwareActivity[]),
	shareReplay(1),
)
