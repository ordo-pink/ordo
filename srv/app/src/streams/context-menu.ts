import { Binary, Nullable, Unary, callOnce } from "#lib/tau/mod"
import { IconType } from "react-icons"
import { combineLatestWith, map, merge, scan, shareReplay, Subject } from "rxjs"
import { BehaviorSubject } from "rxjs"
import { useSubscription } from "src/hooks/use-subscription"
import { CommandListener } from "./commands"

export type UnregisterContextMenuItemFn = Unary<string, void>
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

export type ShowContextMenuParams = {
	x: number
	y: number
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	target: any // TODO: Collect targets
	hideCreateCommands?: boolean
	hideReadCommands?: boolean
	hideUpdateCommands?: boolean
	hideDeleteCommands?: boolean
}

export const contextMenuToggle$ = new BehaviorSubject<Nullable<ShowContextMenuParams>>(null)

export type ContextMenuItemType = "create" | "read" | "update" | "delete"

export type ContextMenuItem = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	shouldShow: (target: any) => boolean
	name: string
	Icon: IconType
	accelerator?: string
	type: ContextMenuItemType
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	disabled?: (target: any) => boolean // TODO: Define target types
	payloadCreator?: (target: any) => any
}

const addContextMenuItem$ = new Subject<ContextMenuItem>()
const removeContextMenuItem$ = new Subject<string>()
const clearContextMenuItems$ = new Subject<null>()

const add = (newContextMenuItem: ContextMenuItem) => (state: ContextMenuItem[]) => {
	const exists = state.some(item => item.name === newContextMenuItem.name)

	return exists ? state : [...state, newContextMenuItem]
}

const remove = (ContextMenuItem: string) => (state: ContextMenuItem[]) =>
	state.filter(a => a.name !== ContextMenuItem)

const clear = () => () => [] as ContextMenuItem[]

export const contextMenuItems$ = merge(
	addContextMenuItem$.pipe(map(add)),
	removeContextMenuItem$.pipe(map(remove)),
	clearContextMenuItems$.pipe(map(clear))
).pipe(
	scan((acc, f) => f(acc), [] as ContextMenuItem[]),
	shareReplay(1)
)

contextMenuItems$.subscribe()

const contextMenu$ = contextMenuToggle$.pipe(
	combineLatestWith(contextMenuItems$),
	map(([toggle, items]) => {
		if (!toggle) return null

		const structure = items.filter(item => item.shouldShow(toggle.target))

		return {
			...toggle,
			structure,
		}
	})
)

export const initContextMenu = callOnce(() => {
	contextMenu$.subscribe()

	return contextMenu$
})

export const registerContextMenuItem: RegisterContextMenuItemFn = (command, item) => {
	addContextMenuItem$.next({ ...item, name: command[0] })
}

export const unregisterContextMenuItem: UnregisterContextMenuItemFn = commandName => {
	removeContextMenuItem$.next(commandName)
}

export const clearContextMenuItems = () => {
	clearContextMenuItems$.next(null)
}

export const showContextMenu = ({
	x,
	y,
	target,
	hideCreateCommands,
	hideDeleteCommands,
	hideReadCommands,
	hideUpdateCommands,
}: ShowContextMenuParams) => {
	contextMenuToggle$.next({
		x,
		y,
		target,
		hideCreateCommands,
		hideDeleteCommands,
		hideReadCommands,
		hideUpdateCommands,
	})
}

export const hideContextMenu = () => {
	contextMenuToggle$.next(null)
}

export const useContextMenu = () => ({
	show: showContextMenu,
	hide: hideContextMenu,
	clear: clearContextMenuItems,
	addItem: registerContextMenuItem,
	remove: unregisterContextMenuItem,
})

export const useContextMenuState = () => useSubscription(contextMenu$)
