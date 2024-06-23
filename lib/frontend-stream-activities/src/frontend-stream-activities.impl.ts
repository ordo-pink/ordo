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

import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"
import { Subject } from "rxjs/internal/Subject"
import { map } from "rxjs/internal/operators/map"
import { merge } from "rxjs/internal/observable/merge"
import { scan } from "rxjs/internal/operators/scan"
import { shareReplay } from "rxjs/internal/operators/shareReplay"

import { N, callOnce, noop } from "@ordo-pink/tau"

import { Either, fromNullableE } from "@ordo-pink/either"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { getLogger } from "@ordo-pink/frontend-logger"

export const __initActivities = callOnce((fid: symbol) => {
	const logger = getLogger(fid)

	logger.debug("Initializing activities...")

	activities$.subscribe()

	logger.debug("Initialized activities.")
})

const add$ = new Subject<Extensions.Activity>()
const remove$ = new Subject<string>()

const add =
	(newActivity: Extensions.Activity) =>
	(state: Extensions.Activity[]): Extensions.Activity[] => [...state, newActivity]

const remove =
	(activityName: string) =>
	(state: Extensions.Activity[]): Extensions.Activity[] =>
		state.filter(activity => activity.name === activityName)

export const currentActivity$ = new BehaviorSubject<Extensions.Activity | null>(null)
export const currentFID$ = new BehaviorSubject<symbol | null>(null)
export const activities$ = merge(add$.pipe(map(add)), remove$.pipe(map(remove))).pipe(
	scan((acc, f) => f(acc), [] as Extensions.Activity[]),
	shareReplay(1),
)

export const registerActivity =
	(fid: symbol | null) =>
	(activity: Extensions.Activity): (() => void) =>
		fromNullableE(fid).fold(
			() => noop,
			fid => {
				add$.next({ ...activity, fid } as any)

				return () => {
					remove$.next(activity.name)
				}
			},
		)

export const useCurrentFID = () => getCurrentFID()

export const getCurrentActivity = (fid: symbol | null): Extensions.Activity | null =>
	Either.fromNullable(fid)
		.chain(checkCurrentActivityQueryPermissionE)
		.fold(N, () => currentActivity$.value)

export const getCurrentFID = () => currentFID$.value

const checkCurrentActivityQueryPermissionE = (fid: symbol) =>
	Either.fromBoolean(
		() => KnownFunctions.checkPermissions(fid, { queries: ["functions.current-activity"] }),
		() => fid,
	)
