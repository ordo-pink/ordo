// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { map, switchMap, scan, shareReplay } from "rxjs/operators"
import { BehaviorSubject, of, merge, Subject } from "rxjs"
import { ComponentType } from "react"
import { Router as Silkrouter, operators } from "silkrouter"
import { Binary, Curry, Nullable, Thunk, Unary, callOnce } from "@ordo-pink/tau/mod"
import { File, FileExtension } from "@ordo-pink/backend-data-service/mod"
import { Logger } from "@ordo-pink/logger/mod"
import { useStrictSubscription, useSubscription } from "$hooks/use-subscription"
import { Router } from "@ordo-pink/libfe/mod"

const { route, noMatch } = operators

export type ContextMenuItemType = "create" | "read" | "update" | "delete"

export type Activity = {
	name: string
	routes: string[]
	Component: ComponentType
	Icon: ComponentType
	Sidebar?: ComponentType
	background?: boolean
}

export type FileAssociation = {
	name: string
	fileExtensions: FileExtension[] | "*"
	Component: ComponentType<{ file: File }>
	Icon: ComponentType<{ file: File; size: IconSize }>
}

export enum IconSize {
	EXTRA_SMALL = "xs",
	SMALL = "sm",
	MEDIUM = "md",
	LARGE = "lg",
	EXTRA_LARGE = "xl",
	TILE = "2xl",
}

export type RegisterActivityFn = Unary<string, Binary<string, Omit<Activity, "name">, void>>
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

const scopeExtensionContextTo = (
	name: string,
	ctx: ExtensionCreatorContext,
): ExtensionCreatorContext => ({
	...ctx,
	// translate: (key: string) => i18next.t(key, { ns: name }),
	// TODO: persistedStore
})

export const createExtension =
	(name: string, callback: (ctx: ExtensionCreatorContext) => any) =>
	(ctx: ExtensionCreatorContext) =>
		callback(scopeExtensionContextTo(name, ctx))

// const isFulfilled = <T>(x: PromiseSettledResult<T>): x is PromiseFulfilledResult<T> =>
// 	x.status === "fulfilled"

type InitExtensionsParams = {
	logger: Logger
	extensions: Thunk<Promise<{ default: Unary<ExtensionCreatorContext, void> }>>[]
	router$: Silkrouter
}

export const initExtensions = callOnce(({ logger, router$, extensions }: InitExtensionsParams) =>
	of(extensions)
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
		.subscribe(),
)

export const currentActivity$ = new BehaviorSubject<Nullable<Activity>>(null)
export const currentRoute$ = new BehaviorSubject<Nullable<Router.Route>>(null)

const add$ = new Subject<Activity>()
const remove$ = new Subject<string>()
const clear$ = new Subject<null>()

type AddP = Curry<Binary<Activity, Activity[], Activity[]>>
const addP: AddP = newActivity => state => [...state, newActivity]

type RemoveP = Curry<Binary<string, Activity[], Activity[]>>
const removeP: RemoveP = activity => state => state.filter(a => a.name === activity)

type ClearP = Thunk<Thunk<Activity[]>>
const clearP: ClearP = () => () => []

export const activities$ = merge(
	add$.pipe(map(addP)),
	remove$.pipe(map(removeP)),
	clear$.pipe(map(clearP)),
).pipe(
	scan((acc, f) => f(acc), [] as Activity[]),
	shareReplay(1),
)

export const initActivities = callOnce(() => {
	activities$.subscribe()

	return activities$
})

type Add = Binary<string, Omit<Activity, "name">, void>
export const add: Add = (name, activity) => add$.next({ ...activity, name })

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
