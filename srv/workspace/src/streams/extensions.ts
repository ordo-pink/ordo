// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { map, switchMap, scan, shareReplay } from "rxjs/operators"
import { BehaviorSubject, of, merge, Subject } from "rxjs"
import { ComponentType } from "react"
import { Router as Silkrouter, operators } from "silkrouter"
import { Binary, Curry, Nullable, Thunk, Unary, callOnce } from "@ordo-pink/tau"
import { Logger } from "@ordo-pink/logger"
import { useStrictSubscription, useSubscription } from "$hooks/use-subscription"
import { Activity, Router, cmd } from "@ordo-pink/frontend-core"
import { FileExtension } from "@ordo-pink/datautil/src/file"
import { getCommands } from "./commands"

const commands = getCommands()
const { route, noMatch } = operators

export type ContextMenuItemType = "create" | "read" | "update" | "delete"

export type FileAssociation = {
	name: string
	fileExtensions: FileExtension[] | "*"
	Component: ComponentType<{ file: File }>
}

export type RegisterActivityFn = Unary<
	string,
	Binary<string, Omit<Activity.Activity, "name">, void>
>
export type RegisterFileAssociationFn = Unary<
	string,
	Binary<string, Omit<FileAssociation, "name">, void>
>

// export type RegisterEditorPluginFn = Unary<
// 	string,
// 	Binary<string, Omit<EditorPlugin, "name">, void>
// >

export type UnregisterEditorPluginFn = Unary<string, Unary<string, void>>

export type UnregisterActivityFn = Unary<string, Unary<string, void>>

export type UnregisterFileAssociationFn = Unary<string, Unary<string, void>>

export type ExtensionCreatorContext = {
	logger: Logger
}

// const isFulfilled = <T>(x: PromiseSettledResult<T>): x is PromiseFulfilledResult<T> =>
// 	x.status === "fulfilled"

type InitExtensionsParams = {
	logger: Logger
	extensions: Thunk<Promise<{ default: Unary<ExtensionCreatorContext, void> }>>[]
	router$: Silkrouter
}

export const initExtensions = callOnce(({ logger, router$, extensions }: InitExtensionsParams) => {
	logger.debug("Initializing extensions")

	commands.on<cmd.activities.add>("activities.add", ({ payload }) => add(payload))
	commands.on<cmd.activities.remove>("activities.remove", ({ payload }) => remove(payload))

	return of(extensions)
		.pipe(
			// map(exts => exts.map(f => f())),
			// mergeMap(exts => Promise.allSettled(exts)),
			// mergeAll(),
			// filter(isFulfilled),
			// map(prop("value")),
			// map(prop("default")),
			// map(f => f({ logger })),
			switchMap(() => activities$),
			map(activities => {
				activities?.map(activity => {
					return activity.routes.forEach(activityRoute => {
						router$ &&
							router$.pipe(route(activityRoute)).subscribe((routeData: Router.Route) => {
								currentActivity$.next(activity)
								currentRoute$.next(routeData)
							})
					})
				})

				router$ &&
					router$.pipe(noMatch(router$)).subscribe(() => {
						currentActivity$.next(null)
						currentRoute$.next(null)
					})
			}),
		)
		.subscribe()
})

export const currentActivity$ = new BehaviorSubject<Nullable<Activity.Activity>>(null)
export const currentRoute$ = new BehaviorSubject<Nullable<Router.Route>>(null)

const add$ = new Subject<Activity.Activity>()
const remove$ = new Subject<string>()
const clear$ = new Subject<null>()

type AddP = Curry<Binary<Activity.Activity, Activity.Activity[], Activity.Activity[]>>
const addP: AddP = newActivity => state => [...state, newActivity]

type RemoveP = Curry<Binary<string, Activity.Activity[], Activity.Activity[]>>
const removeP: RemoveP = activity => state => state.filter(a => a.name === activity)

type ClearP = Thunk<Thunk<Activity.Activity[]>>
const clearP: ClearP = () => () => []

export const activities$ = merge(
	add$.pipe(map(addP)),
	remove$.pipe(map(removeP)),
	clear$.pipe(map(clearP)),
).pipe(
	scan((acc, f) => f(acc), [] as Activity.Activity[]),
	shareReplay(1),
)

activities$.subscribe()

export const initActivities = callOnce(() => {
	return activities$
})

type Add = Unary<Activity.Activity, void>
export const add: Add = activity => add$.next(activity)

type Remove = Unary<string, void>
export const remove: Remove = name => remove$.next(name)

type Clear = Thunk<void>
export const clear: Clear = () => clear$.next(null)

export const useExtensions = () => ({
	activities: { add, remove, clear },
})

export const useCurrentActivity = () => useSubscription(currentActivity$)
export const useRoute = () => useSubscription(currentRoute$)
export const useActivities = () => useStrictSubscription(activities$, [])
