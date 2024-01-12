// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { combineLatestWith, map, merge, scan, shareReplay, Subject } from "rxjs"
import { useCallback, useEffect, useState } from "react"
import { BehaviorSubject } from "rxjs"
import { Either } from "@ordo-pink/either"
import ContextMenuItemList from "$components/context-menu/context-menu-item-list"
import { CtxMenu, useSharedContext } from "@ordo-pink/frontend-core"
import { useAccelerator } from "$hooks/use-accelerator.hook"
import { useSubscription } from "$hooks/use-subscription"
import Null from "$components/null"

export default function ContextMenu() {
	const { commands } = useSharedContext()

	const [readers, setReaders] = useState<CtxMenu.Item[]>([])
	const [creators, setCreators] = useState<CtxMenu.Item[]>([])
	const [updaters, setUpdaters] = useState<CtxMenu.Item[]>([])
	const [removers, setRemovers] = useState<CtxMenu.Item[]>([])

	const menu = useSubscription(contextMenu$)

	useAccelerator("Esc", () => menu && commands.emit<cmd.ctxMenu.hide>("context-menu.hide"), [menu])

	const hideContextMenu = useCallback(
		() => menu && commands.emit<cmd.ctxMenu.hide>("context-menu.hide"),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[menu],
	)

	useEffect(() => {
		commands.on<cmd.ctxMenu.show>("context-menu.show", ({ payload }) => show(payload))
		commands.on<cmd.ctxMenu.add>("context-menu.add", ({ payload }) => add(payload))
		commands.on<cmd.ctxMenu.remove>("context-menu.remove", ({ payload }) => remove(payload))
		commands.on<cmd.ctxMenu.hide>("context-menu.hide", hide)

		return () => {
			commands.off<cmd.ctxMenu.show>("context-menu.show", ({ payload }) => show(payload))
			commands.off<cmd.ctxMenu.add>("context-menu.add", ({ payload }) => add(payload))
			commands.off<cmd.ctxMenu.remove>("context-menu.remove", ({ payload }) => remove(payload))
			commands.off<cmd.ctxMenu.hide>("context-menu.hide", hide)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (!menu) {
			setReaders([])
			setCreators([])
			setUpdaters([])
			setRemovers([])

			return
		}

		// TODO: Fix the approach to handling events
		if (menu.event.preventDefault) menu.event.preventDefault()

		const readCommands = [] as CtxMenu.Item[]
		const createCommands = [] as CtxMenu.Item[]
		const updateCommands = [] as CtxMenu.Item[]
		const deleteCommands = [] as CtxMenu.Item[]

		menu.structure.forEach(item => {
			if (item.type === "create") createCommands.push(item)
			else if (item.type === "read") readCommands.push(item)
			else if (item.type === "update") updateCommands.push(item)
			else if (item.type === "delete") deleteCommands.push(item)
		})

		setCreators(createCommands)
		setReaders(readCommands)
		setUpdaters(updateCommands)
		setRemovers(deleteCommands)

		document.addEventListener("click", hideContextMenu)

		return () => {
			document.removeEventListener("click", hideContextMenu)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [menu])

	return (
		<div
			style={{ top: menu?.event.clientY ?? -50, left: menu?.event.clientX ?? -50 }}
			className={`absolute z-[1000] bg-white dark:bg-neutral-500 shadow-lg transition-opacity w-80 duration-300 rounded-lg px-2 ${
				menu && menu.structure.length ? "opacity-100" : "opacity-0"
			}`}
		>
			{Either.fromNullable(menu).fold(Null, menu => (
				<div className="flex flex-col divide-y">
					{Either.fromBoolean(() => creators.length > 0)
						.chain(() => Either.fromBoolean(() => !menu.hideCreateItems))
						.fold(Null, () => (
							<ContextMenuItemList items={creators} event={menu.event} payload={menu.payload} />
						))}

					{Either.fromBoolean(() => readers.length > 0)
						.chain(() => Either.fromBoolean(() => !menu.hideReadItems))
						.fold(Null, () => (
							<ContextMenuItemList items={readers} event={menu.event} payload={menu.payload} />
						))}

					{Either.fromBoolean(() => updaters.length > 0)
						.chain(() => Either.fromBoolean(() => !menu.hideUpdateItems))
						.fold(Null, () => (
							<ContextMenuItemList items={updaters} event={menu.event} payload={menu.payload} />
						))}

					{Either.fromBoolean(() => removers.length > 0)
						.chain(() => Either.fromBoolean(() => !menu.hideDeleteItems))
						.fold(Null, () => (
							<ContextMenuItemList items={removers} event={menu.event} payload={menu.payload} />
						))}
				</div>
			))}
		</div>
	)
}

// --- Internal ---

type AddP = (i: CtxMenu.Item) => (is: CtxMenu.Item[]) => CtxMenu.Item[]
type RemoveP = (id: string) => (is: CtxMenu.Item[]) => CtxMenu.Item[]
type Add = (item: CtxMenu.Item) => void
type Remove = (id: string) => void
type Show = (item: CtxMenu.ShowOptions) => void
type Hide = () => void

const add: Add = item => add$.next(item)
const remove: Remove = commandName => remove$.next(commandName)
const show: Show = params => params$.next(params)
const hide: Hide = () => params$.next(null)

const addP: AddP = item => state => state.filter(i => i.cmd !== item.cmd).concat([item])
const removeP: RemoveP = name => state => state.filter(item => item.cmd !== name)

const params$ = new BehaviorSubject<CtxMenu.ShowOptions | null>(null)
const add$ = new Subject<CtxMenu.Item>()
const remove$ = new Subject<string>()
const globalItems$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), [] as CtxMenu.Item[]),
	shareReplay(1),
)

const contextMenu$ = params$.pipe(
	combineLatestWith(globalItems$),
	map(([state, items]) =>
		Either.fromNullable(state)
			.chain(state => Either.fromNullable(items).map(() => state))
			.fold(Null, state => ({
				...state,
				structure: items.filter(item => {
					console.log(item)
					const shouldShow =
						item?.shouldShow({ event: state.event, payload: state.payload }) ?? false

					// TODO: Fix the approach to handling events
					if (shouldShow && state.event.stopPropagation) state.event.stopPropagation()

					return shouldShow
				}),
			})),
	),
)
