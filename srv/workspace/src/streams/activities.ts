// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { map, scan, shareReplay } from "rxjs/operators"
import { BehaviorSubject, merge, Subject, Observable } from "rxjs"
import { Binary, Curry, Nullable, callOnce } from "@ordo-pink/tau"
import { Logger } from "@ordo-pink/logger"
import { Extensions, cmd } from "@ordo-pink/frontend-core"
import { getCommands } from "./commands"

const commands = getCommands()

type Params = { logger: Logger }
type Result = { activities$: __Activities$; currentActivity$: __CurrentActivity$ }
type InitActivitiesFn = (params: Params) => Result
export type __Activities$ = Observable<Extensions.Activity[]>
export type __CurrentActivity$ = Observable<Nullable<Extensions.Activity>>
export const __initActivities: InitActivitiesFn = callOnce(({ logger }) => {
	logger.debug("Initializing activities")

	commands.on<cmd.activities.add>("activities.add", ({ payload }) => add$.next(payload))
	commands.on<cmd.activities.remove>("activities.remove", ({ payload }) => remove$.next(payload))
	commands.on<cmd.activities.setCurrent>("activities.set-current", ({ payload }) =>
		currentActivity$.next(payload),
	)

	return { activities$, currentActivity$ }
})

const currentActivity$ = new BehaviorSubject<Nullable<Extensions.Activity>>(null)

const add$ = new Subject<Extensions.Activity>()
const remove$ = new Subject<string>()

type AddP = Curry<Binary<Extensions.Activity, Extensions.Activity[], Extensions.Activity[]>>
const addP: AddP = newActivity => state => [...state, newActivity]

type RemoveP = Curry<Binary<string, Extensions.Activity[], Extensions.Activity[]>>
const removeP: RemoveP = activity => state => state.filter(a => a.name === activity)

const activities$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), [] as Extensions.Activity[]),
	shareReplay(1),
)

activities$.subscribe()
