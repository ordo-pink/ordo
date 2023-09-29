// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { combineLatestWith, map, merge, Observable, scan, shareReplay, Subject } from "rxjs"
import { BehaviorSubject } from "rxjs"
import { Binary, Curry, Nullable, Thunk, Unary, callOnce } from "@ordo-pink/tau"
import { Logger } from "@ordo-pink/logger"
import { Either } from "@ordo-pink/either"
import { getCommands } from "$streams/commands"
import Null from "$components/null"
import { cmd, CtxMenu } from "@ordo-pink/frontend-core"

const commands = getCommands()

// --- Internal ---

export type __ContextMenu$ = Observable<Nullable<CtxMenu.ContextMenu>>
export const __initContextMenu: InitContextMenu = callOnce(({ logger }) => {
	logger.debug("Initializing context menu")

	commands.on<cmd.ctxMenu.show>("context-menu.show", ({ payload }) => show(payload))
	commands.on<cmd.ctxMenu.add>("context-menu.add", ({ payload }) => add(payload))
	commands.on<cmd.ctxMenu.remove>("context-menu.remove", ({ payload }) => remove(payload))
	commands.on<cmd.ctxMenu.hide>("context-menu.hide", hide)

	return contextMenu$
})

type AddP = Curry<Binary<CtxMenu.Item, CtxMenu.Item[], CtxMenu.Item[]>>
type RemoveP = Curry<Binary<string, CtxMenu.Item[], CtxMenu.Item[]>>
type Add = Unary<CtxMenu.Item, void>
type Remove = Unary<string, void>
type Show = Unary<CtxMenu.ShowOptions, void>
type Hide = Thunk<void>
type InitContextMenuP = { logger: Logger }
type InitContextMenu = Unary<InitContextMenuP, Nullable<__ContextMenu$>>

const add: Add = item => add$.next(item)
const remove: Remove = commandName => remove$.next(commandName)
const show: Show = params => params$.next(params)
const hide: Hide = () => params$.next(null)

const addP: AddP = item => state => state.filter(i => i.cmd !== item.cmd).concat([item])
const removeP: RemoveP = name => state => state.filter(item => item.cmd !== name)

const params$ = new BehaviorSubject<Nullable<CtxMenu.ShowOptions>>(null)
const add$ = new Subject<CtxMenu.Item>()
const remove$ = new Subject<string>()
const globalItems$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), [] as CtxMenu.Item[]),
	shareReplay(1),
)

globalItems$.subscribe()

const contextMenu$ = params$.pipe(
	combineLatestWith(globalItems$),
	map(([state, items]) =>
		Either.fromNullable(state).fold(Null, state => ({
			...state,
			structure: items.filter(item => {
				const shouldShow = item.shouldShow({ event: state.event, payload: state.payload })

				if (shouldShow) state.event.stopPropagation()

				return shouldShow
			}),
		})),
	),
)
