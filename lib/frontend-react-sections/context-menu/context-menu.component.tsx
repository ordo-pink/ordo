// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { useCallback, useEffect, useRef, useState } from "react"
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"
import { Subject } from "rxjs/internal/Subject"
import { combineLatestWith } from "rxjs/internal/operators/combineLatestWith"
import { map } from "rxjs/internal/operators/map"
import { merge } from "rxjs/internal/observable/merge"
import { scan } from "rxjs/internal/operators/scan"
import { shareReplay } from "rxjs/internal/operators/shareReplay"

import {
	useAccelerator,
	useCommands,
	useIsMobile,
	useSubscription,
} from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"
import { Switch } from "@ordo-pink/switch"

import Null from "@ordo-pink/frontend-react-components/null"

import ContextMenuItemList from "./context-menu-item-list"
import { LIB_DIRECTORY_FSID } from "@ordo-pink/core"
import { PlainData } from "@ordo-pink/data"

const MENU_WIDTH = 320

/**
 * TODO: Rewrite this.
 */
export default function ContextMenu() {
	const ref = useRef<HTMLDivElement>(null)

	const isMobile = useIsMobile()

	const commands = useCommands()

	const [readers, setReaders] = useState<Client.CtxMenu.Item[]>([])
	const [creators, setCreators] = useState<Client.CtxMenu.Item[]>([])
	const [updaters, setUpdaters] = useState<Client.CtxMenu.Item[]>([])
	const [removers, setRemovers] = useState<Client.CtxMenu.Item[]>([])

	const menu = useSubscription(contextMenu$)

	useAccelerator("Esc", () => menu && commands.emit<cmd.ctx_menu.hide>("context-menu.hide"), [menu])

	const hideContextMenu = useCallback(
		() => menu && commands.emit<cmd.ctx_menu.hide>("context-menu.hide"),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[menu],
	)

	const menuHeight = 40 * readers.concat(creators).concat(updaters).concat(removers).length

	const { x, y } = ref.current?.getBoundingClientRect() ?? { x: -50, y: -50 }

	const windowWidth = window.innerWidth
	const windowHeight = window.innerHeight

	const willFitToBottom = windowHeight - y - menuHeight > 8
	const willFitToRight = windowWidth - x - MENU_WIDTH > 8

	const direction = Switch.OfTrue()
		.case(
			() => !willFitToBottom && !willFitToRight,
			() => "top-left",
		)
		.case(
			() => !willFitToBottom,
			() => "top-right",
		)
		.case(
			() => !willFitToRight,
			() => "bottom-left",
		)
		.default(() => "bottom-right")

	const { top, left } = Switch.of(direction)
		.case(
			direction => !!menu && direction === "bottom-right",
			() => ({
				top: menu!.event.clientY,
				left: menu!.event.clientX,
			}),
		)
		.case(
			direction => !!menu && direction === "bottom-left",
			() => ({
				top: menu!.event.clientY,
				left: menu!.event.clientX - 320,
			}),
		)
		.case(
			direction => !!menu && direction === "top-right",
			() => ({
				top: menu!.event.clientY - menuHeight,
				left: menu!.event.clientX,
			}),
		)
		.case(
			direction => !!menu && direction === "top-left",
			() => ({
				top: menu!.event.clientY - menuHeight,
				left: menu!.event.clientX - 320,
			}),
		)
		.default(() => ({ top: -50, left: -50 }))

	useEffect(() => {
		commands.on<cmd.ctx_menu.show>("context-menu.show", show)
		commands.on<cmd.ctx_menu.add>("context-menu.add", add)
		commands.on<cmd.ctx_menu.remove>("context-menu.remove", remove)
		commands.on<cmd.ctx_menu.hide>("context-menu.hide", hide)

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

		if (menu.event.preventDefault) menu.event.preventDefault()

		const readCommands = [] as Client.CtxMenu.Item[]
		const createCommands = [] as Client.CtxMenu.Item[]
		const updateCommands = [] as Client.CtxMenu.Item[]
		const deleteCommands = [] as Client.CtxMenu.Item[]

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
			ref={ref}
			style={isMobile ? { top, left: 10, alignSelf: "center" } : { top, left }}
			className={`absolute z-[1000] w-80 rounded-lg bg-white px-2 shadow-lg transition-opacity duration-300 dark:bg-neutral-500 ${
				menu && menu.structure.length ? "opacity-100" : "opacity-0"
			}`}
		>
			{Either.fromNullable(menu).fold(Null, menu => (
				<div className="flex flex-col divide-y">
					{Either.fromBoolean(() => creators.length > 0)
						.chain(() => Either.fromBoolean(() => !menu.hide_create_items))
						.fold(Null, () => (
							<ContextMenuItemList items={creators} event={menu.event} payload={menu.payload} />
						))}

					{Either.fromBoolean(() => readers.length > 0)
						.chain(() => Either.fromBoolean(() => !menu.hide_read_items))
						.fold(Null, () => (
							<ContextMenuItemList items={readers} event={menu.event} payload={menu.payload} />
						))}

					{Either.fromBoolean(() => updaters.length > 0)
						.chain(() => Either.fromBoolean(() => !menu.hide_update_items))
						.fold(Null, () => (
							<ContextMenuItemList items={updaters} event={menu.event} payload={menu.payload} />
						))}

					{Either.fromBoolean(() => removers.length > 0)
						.chain(() => Either.fromBoolean(() => !menu.hide_delete_items))
						.fold(Null, () => (
							<ContextMenuItemList items={removers} event={menu.event} payload={menu.payload} />
						))}
				</div>
			))}
		</div>
	)
}

// --- Internal ---

type AddP = (i: Client.CtxMenu.Item) => (is: Client.CtxMenu.Item[]) => Client.CtxMenu.Item[]
type RemoveP = (id: string) => (is: Client.CtxMenu.Item[]) => Client.CtxMenu.Item[]
type Add = (item: Client.CtxMenu.Item) => void
type Remove = (id: string) => void
type Show = (item: Client.CtxMenu.ShowOptions) => void
type Hide = () => void

const add: Add = item => add$.next(item)
const remove: Remove = commandName => remove$.next(commandName)
const show: Show = params => params$.next(params)
const hide: Hide = () => params$.next(null)

const addP: AddP = item => state => state.filter(i => i.cmd !== item.cmd).concat([item])
const removeP: RemoveP = name => state => state.filter(item => item.cmd !== name)

const params$ = new BehaviorSubject<Client.CtxMenu.ShowOptions | null>(null)
const add$ = new Subject<Client.CtxMenu.Item>()
const remove$ = new Subject<string>()
const globalItems$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), [] as Client.CtxMenu.Item[]),
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
					const shouldShow =
						state.payload &&
						(((state.payload as PlainData).fsid &&
							(state.payload as PlainData).fsid === LIB_DIRECTORY_FSID) ||
							state.payload === LIB_DIRECTORY_FSID)
							? false
							: item?.should_show({ event: state.event, payload: state.payload }) ?? false

					if (shouldShow && state.event.stopPropagation) state.event.stopPropagation()

					return shouldShow
				}),
			})),
	),
)
