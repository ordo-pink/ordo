import { combineLatestWith, map, merge, Observable, scan, shareReplay, Subject } from "rxjs"
import { IconType } from "react-icons"
import { BehaviorSubject } from "rxjs"
import { Binary, Curry, Nullable, Thunk, Unary, callOnce } from "#lib/tau/mod"
import { Logger } from "#lib/logger/mod"
import { Either } from "#lib/either/mod"
import Null from "$components/null"

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
	 * Name of the context command to be invoked when the context menu item is used.
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
	 * Right click coordinate X.
	 */
	x: number

	/**
	 * Right click coordinate Y.
	 */
	y: number

	/**
	 * Right click target element.
	 */
	target: HTMLElement

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
export type ContextMenuItemMethodP<T = any> = { target: HTMLElement; payload?: T }

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

/**
 * Entrypoint for using context menu.
 */
export const getContextMenu = () => ({
	/**
	 * Show context menu for given target element as well as mouse (x, y) coordinate.
	 */
	show,

	/**
	 * Hide context menu.
	 */
	hide,

	/**
	 * Clear context menu items.
	 */
	clear,

	/**
	 * Add context menu item.
	 */
	add,

	/**
	 * Remove context menu item.
	 */
	remove,
})

// --- Internal ---

export type __ContextMenu$ = Observable<Nullable<ContextMenu>>
export const __initContextMenu: InitContextMenu = callOnce(({ logger }) => {
	logger.debug("Initializing context menu")

	return contextMenu$
})

type AddP = Curry<Binary<ContextMenuItem, ContextMenuItem[], ContextMenuItem[]>>
type RemoveP = Curry<Binary<string, ContextMenuItem[], ContextMenuItem[]>>
type ClearP = Thunk<Thunk<ContextMenuItem[]>>
type Add = Unary<ContextMenuItem, void>
type Remove = Unary<string, void>
type Clear = Thunk<void>
type Show = Unary<ShowContextMenuP, void>
type Hide = Thunk<void>
type InitContextMenuP = { logger: Logger }
type InitContextMenu = Unary<InitContextMenuP, Nullable<__ContextMenu$>>

const add: Add = item => add$.next(item)
const remove: Remove = commandName => remove$.next(commandName)
const clear: Clear = () => clear$.next(null)
const show: Show = params => params$.next(params)
const hide: Hide = () => params$.next(null)

const addP: AddP = newContextMenuItem => state =>
	state.some(item => item.commandName === newContextMenuItem.commandName)
		? state
		: [...state, newContextMenuItem]
const removeP: RemoveP = name => state => state.filter(a => a.commandName !== name)
const clearP: ClearP = () => () => []

const params$ = new BehaviorSubject<Nullable<ShowContextMenuP>>(null)
const add$ = new Subject<ContextMenuItem>()
const remove$ = new Subject<string>()
const clear$ = new Subject<null>()
const contextMenuItems$ = merge(
	add$.pipe(map(addP)),
	remove$.pipe(map(removeP)),
	clear$.pipe(map(clearP))
).pipe(
	scan((acc, f) => f(acc), [] as ContextMenuItem[]),
	shareReplay(1)
)

contextMenuItems$.subscribe()

const contextMenu$ = params$.pipe(
	combineLatestWith(contextMenuItems$),
	map(([state, items]) =>
		Either.fromNullable(state).fold(Null, state => ({
			...state,
			structure: items.filter(item =>
				item.shouldShow({ target: state.target, payload: state.payload })
			),
		}))
	)
)
