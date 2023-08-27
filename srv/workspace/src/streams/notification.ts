// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { map, merge, Observable, scan, shareReplay, Subject } from "rxjs"
import { Binary, Curry, Unary, callOnce } from "@ordo-pink/tau"
import { Logger } from "@ordo-pink/logger"
import { getCommands } from "$streams/commands"
import { cmd, Notification } from "@ordo-pink/frontend-core"

const commands = getCommands()

// --- Internal ---

export type __Notification$ = Observable<Notification.RegisterredItem[]>
export const __initNotification: InitNotification = callOnce(({ logger }) => {
	logger.debug("Initializing notifications")

	commands.on<cmd.notification.show>("notification.show", ({ payload }) => show(payload))
	commands.on<cmd.notification.hide>("notification.hide", ({ payload }) => hide(payload))

	notification$.subscribe()

	return notification$
})

type AddP = Curry<
	Binary<
		Notification.RegisterredItem,
		Notification.RegisterredItem[],
		Notification.RegisterredItem[]
	>
>
type RemoveP = Curry<Binary<string, Notification.RegisterredItem[], Notification.RegisterredItem[]>>
type Add = Unary<Notification.Item, void>
type Remove = Unary<string, void>
type InitNotificationP = { logger: Logger }
type InitNotification = Unary<InitNotificationP, __Notification$>

const show: Add = item => add$.next({ ...item, id: crypto.randomUUID() })
const hide: Remove = id => remove$.next(id)

const addP: AddP = item => state =>
	state.some(({ id }) => id === item.id) ? state : [...state, item]
const removeP: RemoveP = id => state => state.filter(a => a.id !== id)

const add$ = new Subject<Notification.RegisterredItem>()
const remove$ = new Subject<string>()
const notification$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), [] as Notification.RegisterredItem[]),
	shareReplay(1),
)
