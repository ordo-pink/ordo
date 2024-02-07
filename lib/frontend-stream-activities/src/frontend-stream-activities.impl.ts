// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"
import { Subject } from "rxjs/internal/Subject"
import { map } from "rxjs/internal/operators/map"
import { merge } from "rxjs/internal/observable/merge"
import { scan } from "rxjs/internal/operators/scan"
import { shareReplay } from "rxjs/internal/operators/shareReplay"

import { N, callOnce } from "@ordo-pink/tau"
import { getCommands } from "@ordo-pink/frontend-stream-commands"

import { Either } from "@ordo-pink/either"
import { KnownFunctions } from "@ordo-pink/known-functions"
import { getLogger } from "@ordo-pink/frontend-logger"

export const __initActivities = callOnce((fid: symbol) => {
	const logger = getLogger(fid)
	const commands = getCommands(fid)

	logger.debug("Initializing activities...")

	commands.on<cmd.activities.add>("activities.add", ({ payload }) => add$.next(payload))
	commands.on<cmd.activities.remove>("activities.remove", ({ payload }) => remove$.next(payload))
	commands.on<cmd.activities.setCurrent>("activities.set-current", ({ payload }) =>
		currentActivity$.next(payload),
	)

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

export const useCurrentFID = () => getCurrentFID()

export const getCurrentActivity = (fid: symbol | null): Extensions.Activity | null =>
	Either.fromNullable(fid)
		.chain(checkCurrentActivityQueryPermissionE)
		.fold(N, () => currentActivity$.value)

export const getCurrentFID = () => currentFID$.value

export const getActivities$ = (fid: symbol) =>
	Either.fromNullable(fid)
		.chain(checkActivitiesQueryPermissionE)
		.fold(N, () => activities$)

const checkActivitiesQueryPermissionE = (fid: symbol) =>
	Either.fromBoolean(
		() => KnownFunctions.checkPermissions(fid, { queries: [] }),
		() => fid,
	)

const checkCurrentActivityQueryPermissionE = (fid: symbol) =>
	Either.fromBoolean(
		() => KnownFunctions.checkPermissions(fid, { queries: ["functions.current-activity"] }),
		() => fid,
	)
