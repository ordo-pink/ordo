// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { combineLatestWith, map, merge, Observable, scan, shareReplay, Subject } from "rxjs"
import { BehaviorSubject } from "rxjs"
import { Binary, Curry, Nullable, Thunk, Unary, callOnce } from "@ordo-pink/tau/mod"
import { Logger } from "@ordo-pink/logger/mod"
import { Either } from "@ordo-pink/either/mod"
import { getCommands } from "$streams/commands"
import Null from "$components/null"
import { ContextMenu } from "@ordo-pink/libfe/mod"

const commands = getCommands()

// --- Internal ---

export type __ContextMenu$ = Observable<Nullable<ContextMenu.ContextMenu>>
export const __initContextMenu: InitContextMenu = callOnce(({ logger }) => {
	logger.debug("Initializing context menu")

	commands.on("context-menu.show", ({ payload }) => show(payload))
	commands.on("context-menu.add", ({ payload }) => add(payload))
	commands.on("context-menu.remove", ({ payload }) => remove(payload))
	commands.on("context-menu.hide", hide)

	return contextMenu$
})

type AddP = Curry<Binary<ContextMenu.Item, ContextMenu.Item[], ContextMenu.Item[]>>
type RemoveP = Curry<Binary<string, ContextMenu.Item[], ContextMenu.Item[]>>
type Add = Unary<ContextMenu.Item, void>
type Remove = Unary<string, void>
type Show = Unary<ContextMenu.ShowOptions, void>
type Hide = Thunk<void>
type InitContextMenuP = { logger: Logger }
type InitContextMenu = Unary<InitContextMenuP, Nullable<__ContextMenu$>>

const add: Add = item => add$.next(item)
const remove: Remove = commandName => remove$.next(commandName)
const show: Show = params => params$.next(params)
const hide: Hide = () => params$.next(null)

const addP: AddP = item => state =>
	state.some(({ commandName }) => commandName === item.commandName) ? state : [...state, item]
const removeP: RemoveP = name => state => state.filter(a => a.commandName !== name)

const params$ = new BehaviorSubject<Nullable<ContextMenu.ShowOptions>>(null)
const add$ = new Subject<ContextMenu.Item>()
const remove$ = new Subject<string>()
const globalItems$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), [] as ContextMenu.Item[]),
	shareReplay(1),
)

globalItems$.subscribe()

const contextMenu$ = params$.pipe(
	combineLatestWith(globalItems$),
	map(([state, items]) =>
		Either.fromNullable(state).fold(Null, state => ({
			...state,
			structure: items.filter(item =>
				item.shouldShow({ event: state.event, payload: state.payload }),
			),
		})),
	),
)
