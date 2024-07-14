// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { BehaviorSubject, Subject, map, merge, scan, shareReplay } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { RRR, type TRrr } from "@ordo-pink/data"
import {
	type TFIDAwareActivity,
	type TGetActivitiesFn,
	type TGetCurrentActivityFn,
	type TRegisterActivityFn,
	type TSetCurrentActivityFn,
	type TUnregisterActivityFn,
} from "@ordo-pink/core"
import { call_once, omit } from "@ordo-pink/tau"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { R } from "@ordo-pink/result"

type TInitActivitiesFn = () => {
	register_activity: TRegisterActivityFn
	unregister_activity: TUnregisterActivityFn
	get_activities: TGetActivitiesFn
	get_current_activity: TGetCurrentActivityFn
	set_current_activity: TSetCurrentActivityFn
}
export const __init_activities: TInitActivitiesFn = call_once(() => {
	aggregated_activities$.subscribe({ next: value => activities$.next(value) })

	return {
		current_activity$,

		get_activities: fid => () =>
			R.If(KnownFunctions.check_is_internal(fid))
				.pipe(R.ops.err_map(_log_invalid_fid(fid, "get_activities")))
				.pipe(R.ops.map(() => activities$)),

		get_current_activity: fid => () =>
			R.If(KnownFunctions.check_permissions(fid, { queries: ["functions.current-activity"] }))
				.pipe(R.ops.err_map(_log_invalid_fid(fid, "get_current_activity")))
				.pipe(R.ops.map(() => current_activity$.asObservable())),

		set_current_activity: fid => name =>
			R.If(KnownFunctions.check_is_internal(fid))
				.pipe(R.ops.err_map(_log_invalid_fid(fid, "set_current_activity")))
				.pipe(
					R.ops.chain(() =>
						R.FromNullable(activities$.getValue().find(a => a.name === name)).pipe(
							R.ops.err_map(_log_activity_not_found(name)),
						),
					),
				)
				.pipe(R.ops.map(omit("fid")))
				.pipe(R.ops.map(activity => current_activity$.next(O.Some(activity)))),

		register_activity: fid => new_activity =>
			R.FromNullable(fid)

				.pipe(R.ops.err_map(_log_invalid_fid(fid, "register_activity")))
				.pipe(
					R.ops.chain(fid =>
						R.If(!activities$.getValue().some(activity => activity.name === new_activity.name), {
							T: () => fid,
							F: _log_already_exists(new_activity.name),
						}),
					),
				)
				.pipe(R.ops.map(fid => add$.next({ ...new_activity, fid }))),

		unregister_activity: fid => name =>
			R.FromNullable(fid)
				.pipe(R.ops.err_map(_log_invalid_fid(fid, "unregister_activity")))
				.pipe(
					R.ops.chain(fid =>
						R.FromNullable(
							activities$.getValue().find(activity => activity.name === name),
							_log_activity_not_found(name),
						).pipe(
							R.ops.chain(activity =>
								R.If(activity.fid === fid || KnownFunctions.check_is_internal(fid), {
									F: _log_different_fid(fid),
								}),
							),
						),
					),
				)
				.pipe(R.ops.map(() => remove$.next(name))),
	}
})

// --- Internal ---

const LOCATION = "Init activities"

const eperm = RRR.codes.eperm(LOCATION)
const eexist = RRR.codes.eexist(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)

type TLogInvalidFIDFn = (fid: symbol | null, fn: string) => () => TRrr<"EPERM">
const _log_invalid_fid: TLogInvalidFIDFn = (fid, fn) => () => eperm(`${fn} -> fid: ${String(fid)}`)

type TLogAlreadyExistsFn = (name: string) => () => TRrr<"EEXIST">
const _log_already_exists: TLogAlreadyExistsFn = name => () =>
	eexist(`Activity "${name}" already registered`)

type TLogDifferentFIDFn = (fid: symbol | null) => () => TRrr<"EPERM">
const _log_different_fid: TLogDifferentFIDFn = fid => () =>
	eperm(`Only the activity itself can unregister: ${String(fid)}`)

type TLogActivityNotFoundFn = (name: string) => () => TRrr<"ENOENT">
const _log_activity_not_found: TLogActivityNotFoundFn = name => () =>
	enoent(`Activity with name "${name}" is not registerred`)

const add$ = new Subject<TFIDAwareActivity>()
const remove$ = new Subject<string>()

const add =
	(new_activity: TFIDAwareActivity) =>
	(state: TFIDAwareActivity[]): TFIDAwareActivity[] => [...state, new_activity]

const remove =
	(name: string) =>
	(state: TFIDAwareActivity[]): TFIDAwareActivity[] =>
		state.filter(activity => activity.name === name)

const current_activity$ = new BehaviorSubject<TOption<Functions.Activity>>(O.None())
const activities$ = new BehaviorSubject<TFIDAwareActivity[]>([])

const aggregated_activities$ = merge(add$.pipe(map(add)), remove$.pipe(map(remove))).pipe(
	scan((acc, f) => f(acc), [] as TFIDAwareActivity[]),
	shareReplay(1),
)
