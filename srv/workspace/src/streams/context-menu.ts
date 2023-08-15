import { combineLatestWith, map, merge, Observable, scan, shareReplay, Subject } from "rxjs"
import { IconType } from "react-icons"
import { BehaviorSubject } from "rxjs"
import { Binary, Curry, Nullable, Thunk, Unary, callOnce } from "#lib/tau/mod"
import { Logger } from "#lib/logger/mod"
import { Either } from "#lib/either/mod"
import { getCommands } from "$streams/commands"
import Null from "$components/null"
import { MouseEvent } from "react"

const commands = getCommands()

// --- Public ---

/**
 * Context menu item.
 */
export type ContextMenuItem<T = any> = {
	/**
	 * Check whether the item needs to be shown.
	 */
	shouldShow: ContextMenuItemMethod<T, boolean>

	/**
	 * @see ContextMenuItemType
	 */
	type: ContextMenuItemType

	/**
	 * Name of the command to be invoked when the context menu item is used.
	 */
	commandName: `${string}.${string}`

	/**
	 * Readable name of the context menu item. Put a translated value here.
	 */
	readableName: string

	/**
	 * Icon to be displayed for the context menu item.
	 */
	Icon: IconType

	/**
	 * Keyboard accelerator for the context menu item. It only works while the context menu is
	 * opened.
	 *
	 * @optional
	 */
	accelerator?: string

	/**
	 * Check whether the item needs to be shown disabled.
	 *
	 * @optional
	 * @default () => false
	 */
	shouldBeDisabled?: ContextMenuItemMethod<T, boolean>

	/**
	 * This function allows you to override the incoming payload that will be passed to the command
	 * invoked by the context menu item.
	 *
	 * @optional
	 * @default () => payload
	 */
	payloadCreator?: ContextMenuItemMethod<T>
}

/**
 * Show context menu item parameters.
 */
export type ShowContextMenuP = {
	/**
	 * Accepted mouse event.
	 */
	event: MouseEvent

	/**
	 * Payload to be passed to the context menu item methods.
	 * @optional
	 */
	payload?: any

	/**
	 * Avoid showing create items.
	 * @optional
	 * @default false
	 */
	hideCreateItems?: boolean

	/**
	 * Avoid showing read items.
	 * @optional
	 * @default false
	 */
	hideReadItems?: boolean

	/**
	 * Avoid showing update items.
	 * @optional
	 * @default false
	 */
	hideUpdateItems?: boolean

	/**
	 * Avoid showing delete items.
	 * @optional
	 * @default false
	 */
	hideDeleteItems?: boolean
}

/**
 * Context menu item method parameters.
 */
export type ContextMenuItemMethodP<T = any> = { event: MouseEvent; payload?: T }

/**
 * Context menu item method descriptor.
 */
export type ContextMenuItemMethod<T = any, Result = any> = Unary<ContextMenuItemMethodP<T>, Result>

/**
 * Context menu item type. This impacts two things:
 *
 * 1. Grouping items in the context menu.
 * 2. Given type can be hidden when showing context menu.
 */
export type ContextMenuItemType = "create" | "read" | "update" | "delete"

/**
 * Context menu.
 */
export type ContextMenu = ShowContextMenuP & {
	/**
	 * Items to be shown in the context menu.
	 */
	structure: ContextMenuItem[]
}

// --- Internal ---

export type __ContextMenu$ = Observable<Nullable<ContextMenu>>
export const __initContextMenu: InitContextMenu = callOnce(({ logger }) => {
	logger.debug("Initializing context menu")

	commands.on("context-menu.show", ({ payload }) => show(payload))
	commands.on("context-menu.add", ({ payload }) => add(payload))
	commands.on("context-menu.remove", ({ payload }) => remove(payload))
	commands.on("context-menu.hide", hide)

	return contextMenu$
})

type AddP = Curry<Binary<ContextMenuItem, ContextMenuItem[], ContextMenuItem[]>>
type RemoveP = Curry<Binary<string, ContextMenuItem[], ContextMenuItem[]>>
type Add = Unary<ContextMenuItem, void>
type Remove = Unary<string, void>
type Show = Unary<ShowContextMenuP, void>
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

const params$ = new BehaviorSubject<Nullable<ShowContextMenuP>>(null)
const add$ = new Subject<ContextMenuItem>()
const remove$ = new Subject<string>()
const globalContextMenuItems$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), [] as ContextMenuItem[]),
	shareReplay(1)
)

globalContextMenuItems$.subscribe()

const contextMenu$ = params$.pipe(
	combineLatestWith(globalContextMenuItems$),
	map(([state, items]) =>
		Either.fromNullable(state).fold(Null, state => ({
			...state,
			structure: items.filter(item =>
				item.shouldShow({ event: state.event, payload: state.payload })
			),
		}))
	)
)
