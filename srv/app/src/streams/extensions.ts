import { Logger } from "#lib/logger/mod"
import { Binary, Nullable, Thunk, Unary, callOnce } from "#lib/tau/mod"
import i18next from "i18next"
import { UserInfo } from "os"
import { prop } from "ramda"
import { ComponentType } from "react"
import { mergeMap, BehaviorSubject, mergeAll, Observable, of, merge, Subject } from "rxjs"
import { map, filter, switchMap, scan, shareReplay } from "rxjs/operators"
import { Router } from "silkrouter"
import {
	CommandListener,
	RegisterCommandFn,
	ExecuteCommandFn,
	prependListener,
	appendListener,
	registerCommand,
	unregisterCommand,
	executeCommand,
	Command,
	PayloadCommand,
} from "./commands"
import { route, Route, noMatch } from "./router"
import { RegisterTranslationsFn, registerTranslations } from "./translations"
import { File, FileExtension } from "#lib/universal-data-service/mod"
import { IconType } from "react-icons"
import { User } from "#lib/backend-user-service/mod"
import { CommandPaletteItem } from "./command-palette"

export type ContextMenuItemType = "create" | "read" | "update" | "delete"

export type ContextMenuItem = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	shouldShow: (target: any) => boolean
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	payloadCreator: (target: any) => any
	extensionName: string
	commandName: string
	name: string
	Icon: IconType
	accelerator?: string
	type: ContextMenuItemType
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	disabled?: (target: any) => boolean
}

export type Activity = {
	name: string
	routes: string[]
	Component: ComponentType
	Icon: ComponentType
	Sidebar?: ComponentType
	show?: boolean
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
export type RegisterContextMenuItemFn = Binary<
	CommandListener,
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		shouldShow: (target: any) => boolean
		Icon: IconType
		accelerator?: string
		type: "create" | "read" | "update" | "delete"
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		disabled?: (target: any) => boolean
		payloadCreator?: () => any
	},
	void
>

export type RegisterFileAssociationFn = Unary<
	string,
	Binary<string, Omit<FileAssociation, "name">, void>
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegisterCommandPaletteItemFn = Unary<CommandPaletteItem, void>

// export type RegisterEditorPluginFn = Unary<
// 	string,
// 	Binary<string, Omit<EditorPlugin, "name">, void>
// >

export type UnregisterEditorPluginFn = Unary<string, Unary<string, void>>
export type UnregisterCommandPaletteItemFn = Unary<string, void>
export type UnregisterActivityFn = Unary<string, Unary<string, void>>
export type UnregisterContextMenuItemFn = Unary<string, void>
export type UnregisterFileAssociationFn = Unary<string, Unary<string, void>>

export type ExtensionCreatorContext = {
	commands: {
		before: RegisterCommandFn
		after: RegisterCommandFn
		on: RegisterCommandFn
		off: RegisterCommandFn
		emit: ExecuteCommandFn
	}
	// registerEditorPlugin: RegisterEditorPluginFn
	// unregisterEditorPlugin: UnregisterEditorPluginFn
	// registerContextMenuItem: RegisterContextMenuItemFn
	// unregisterContextMenuItem: UnregisterContextMenuItemFn
	registerActivity: RegisterActivityFn
	unregisterActivity: UnregisterActivityFn
	// registerFileAssociation: RegisterFileAssociationFn
	// unregisterFileAssociation: UnregisterFileAssociationFn
	registerTranslations: RegisterTranslationsFn
	// registerCommandPaletteItem: RegisterCommandPaletteItemFn
	// unregisterCommandPaletteItem: UnregisterCommandPaletteItemFn
	logger: Logger
}

const scopeExtensionContextTo = (
	name: string,
	ctx: ExtensionCreatorContext
): ExtensionCreatorContext => ({
	...ctx,
	// translate: (key: string) => i18next.t(key, { ns: name }),
	// TODO: persistedStore
})

export const createExtension =
	(name: string, callback: (ctx: ExtensionCreatorContext) => void | Promise<void>) =>
	(ctx: ExtensionCreatorContext) =>
		callback(scopeExtensionContextTo(name, ctx))

const isFulfilled = <T>(x: PromiseSettledResult<T>): x is PromiseFulfilledResult<T> =>
	x.status === "fulfilled"

type InitExtensionsParams = {
	logger: Logger
	contextMenu$: Observable<
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Nullable<{ x: number; y: number; target: any; structure: ContextMenuItem[] }>
	>
	extensions: Thunk<Promise<{ default: Unary<ExtensionCreatorContext, void> }>>[]
	router$: Router
}

export const initExtensions = callOnce(({ logger, router$, extensions }: InitExtensionsParams) =>
	of(extensions)
		.pipe(
			map(exts => exts.map(f => f())),
			mergeMap(exts => Promise.allSettled(exts)),
			mergeAll(),
			filter(isFulfilled),
			map(prop("value")),
			map(prop("default")),
			map(f =>
				f({
					commands: {
						before: prependListener,
						after: appendListener,
						on: registerCommand,
						off: unregisterCommand,
						emit: executeCommand,
					},
					// registerEditorPlugin,
					// unregisterEditorPlugin,
					// registerCommandPaletteItem,
					// unregisterCommandPaletteItem,
					// registerContextMenuItem,
					// unregisterContextMenuItem,
					registerTranslations,
					// registerFileAssociation,
					// unregisterFileAssociation,
					registerActivity,
					unregisterActivity,
					logger,
				})
			),
			switchMap(() => activities$),
			map(activities => {
				activities?.map(activity => {
					return activity.routes.map(activityRoute => {
						router$.pipe(route(activityRoute)).subscribe((routeData: Route) => {
							currentActivity$.next(activity)
							currentRoute$.next(routeData)
						})
					})
				})

				router$.pipe(noMatch(router$)).subscribe(() => {
					currentActivity$.next(null)
					currentRoute$.next(null)
				})
			})
		)
		.subscribe()
)

export const currentActivity$ = new BehaviorSubject<Nullable<Activity>>(null)
export const currentRoute$ = new BehaviorSubject<Nullable<Route>>(null)

export const isPayloadCommand = (cmd: Command): cmd is PayloadCommand =>
	typeof cmd.name === "string" && (cmd as PayloadCommand).payload !== undefined

const addActivity$ = new Subject<Activity>()
const removeActivity$ = new Subject<string>()
const clearActivities$ = new Subject<null>()

const add = (newActivity: Activity) => (state: Activity[]) => [...state, newActivity]

const remove = (activity: string) => (state: Activity[]) => state.filter(a => a.name === activity)

const clear = () => () => [] as Activity[]

export const activities$ = merge(
	addActivity$.pipe(map(add)),
	removeActivity$.pipe(map(remove)),
	clearActivities$.pipe(map(clear))
).pipe(
	scan((acc, f) => f(acc), [] as Activity[]),
	shareReplay(1)
)

export const initActivities = callOnce(() => {
	activities$.subscribe()

	return activities$
})

export const registerActivity =
	(extensionName: string) => (name: string, activity: Omit<Activity, "name">) => {
		addActivity$.next({
			...activity,
			name: `${extensionName}.${name}`,
		})
	}

export const unregisterActivity = (extensionName: string) => (name: string) => {
	removeActivity$.next(`${extensionName}.${name}`)
}

export const clearActivities = () => {
	clearActivities$.next(null)
}
