// // SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// // SPDX-License-Identifier: AGPL-3.0-only

// // Ordo.pink is an all-in-one team workspace.
// // Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// // This program is free software: you can redistribute it and/or modify
// // it under the terms of the GNU Affero General Public License as published
// // by the Free Software Foundation, either version 3 of the License, or
// // (at your option) any later version.

// // This program is distributed in the hope that it will be useful,
// // but WITHOUT ANY WARRANTY; without even the implied warranty of
// // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// // GNU Affero General Public License for more details.

// // You should have received a copy of the GNU Affero General Public License
// // along with this program.  If not, see <https://www.gnu.org/licenses/>.

// import { BehaviorSubject, Subject, combineLatestWith, map, merge, scan, shareReplay } from "rxjs"
// import { useCallback, useEffect, useRef, useState } from "react"
// import { createRoot } from "react-dom/client"

// import { LIB_DIRECTORY_FSID, type TOrdoContext } from "@ordo-pink/core"
// import { create_ordo_context, use$ } from "@ordo-pink/frontend-react-hooks"
// import { Either } from "@ordo-pink/either"
// import { Metadata } from "@ordo-pink/managers"
// import { Result } from "@ordo-pink/result"
// import { Switch } from "@ordo-pink/switch"
// import { type TLogger } from "@ordo-pink/logger"

// import Accelerator from "@ordo-pink/frontend-react-components/accelerator"
// import ActionListItem from "@ordo-pink/frontend-react-components/action-list-item"
// import Null from "@ordo-pink/frontend-react-components/null"
// import RenderFromNullable from "@ordo-pink/frontend-react-components/render-from-nullable"

// export const init_context_menu = (
// 	logger: TLogger,
// 	commands: Ordo.Command.Commands,
// 	ctx: TOrdoContext,
// ) => {
// 	logger.debug("🟡 Initialising context menu...")

// 	custom_context_menu$.subscribe()
// 	global_context_menu$.subscribe()

// 	commands.on("cmd.application.context_menu.show", menu => custom_context_menu$.next(menu))
// 	commands.on("cmd.application.context_menu.hide", () => custom_context_menu$.next(null))
// 	commands.on("cmd.application.context_menu.add", item => add$.next(item))
// 	commands.on("cmd.application.context_menu.remove", name => remove$.next(name))

// 	const context_menu_element = document.querySelector("#context-menu") as HTMLDivElement
// 	const root = createRoot(context_menu_element)

// 	// TODO: Drop React
// 	root.render(
// 		<Provider value={ctx}>
// 			<ContextMenu />
// 		</Provider>,
// 	)

// 	logger.debug("🟢 Initialised context menu.")
// }

// const Provider = create_ordo_context()

// const MENU_WIDTH = 320

// /**
//  * TODO: Rewrite this.
//  */
// function ContextMenu() {
// 	const ref = useRef<HTMLDivElement>(null)

// 	const is_mobile = use$.is_mobile()
// 	const commands = use$.commands()
// 	const logger = use$.logger()

// 	const [readers, set_readers] = useState<Client.CtxMenu.Item[]>([])
// 	const [creators, set_creators] = useState<Client.CtxMenu.Item[]>([])
// 	const [updaters, set_updaters] = useState<Client.CtxMenu.Item[]>([])
// 	const [removers, set_removers] = useState<Client.CtxMenu.Item[]>([])

// 	const menu = use$.subscription(context_menu$)

// 	const hide_context_menu = useCallback(
// 		() => menu && commands.emit("cmd.application.context_menu.hide"),
// 		[menu, commands],
// 	)

// 	use$.accelerator("Esc", hide_context_menu, [menu])

// 	const menu_height = 40 * readers.concat(creators).concat(updaters).concat(removers).length

// 	const { x, y } = ref.current?.getBoundingClientRect() ?? { x: -50, y: -50 }

// 	const window_width = window.innerWidth
// 	const window_height = window.innerHeight

// 	const will_fit_bottom = window_height - y - menu_height > 8
// 	const will_fit_right = window_width - x - MENU_WIDTH > 8

// 	const direction = Switch.OfTrue()
// 		.case(
// 			() => !will_fit_bottom && !will_fit_right,
// 			() => "top-left",
// 		)
// 		.case(
// 			() => !will_fit_bottom,
// 			() => "top-right",
// 		)
// 		.case(
// 			() => !will_fit_right,
// 			() => "bottom-left",
// 		)
// 		.default(() => "bottom-right")

// 	const { top, left } = Switch.of(direction)
// 		.case(
// 			direction => !!menu && direction === "bottom-right",
// 			() => ({
// 				top: menu!.event.clientY,
// 				left: menu!.event.clientX,
// 			}),
// 		)
// 		.case(
// 			direction => !!menu && direction === "bottom-left",
// 			() => ({
// 				top: menu!.event.clientY,
// 				left: menu!.event.clientX - 320,
// 			}),
// 		)
// 		.case(
// 			direction => !!menu && direction === "top-right",
// 			() => ({
// 				top: menu!.event.clientY - menu_height,
// 				left: menu!.event.clientX,
// 			}),
// 		)
// 		.case(
// 			direction => !!menu && direction === "top-left",
// 			() => ({
// 				top: menu!.event.clientY - menu_height,
// 				left: menu!.event.clientX - 320,
// 			}),
// 		)
// 		.default(() => ({ top: -50, left: -50 }))

// 	useEffect(() => {
// 		if (!menu) {
// 			set_readers([])
// 			set_creators([])
// 			set_updaters([])
// 			set_removers([])

// 			return
// 		}

// 		if (menu.event.preventDefault) menu.event.preventDefault()

// 		const read_cmds = [] as Client.CtxMenu.Item[]
// 		const create_cmds = [] as Client.CtxMenu.Item[]
// 		const update_cmds = [] as Client.CtxMenu.Item[]
// 		const delete_cmds = [] as Client.CtxMenu.Item[]

// 		menu.structure.forEach(item => {
// 			Switch.Match(item.type)
// 				.case("read", () => read_cmds.push(item))
// 				.case("create", () => create_cmds.push(item))
// 				.case("update", () => update_cmds.push(item))
// 				.case("delete", () => delete_cmds.push(item))
// 				.default(() =>
// 					logger.alert(`Context menu item "${item.readable_name}" type "${item.type}" is invalid`),
// 				)
// 		})

// 		set_readers(read_cmds)
// 		set_creators(create_cmds)
// 		set_updaters(update_cmds)
// 		set_removers(delete_cmds)

// 		document.addEventListener("click", hide_context_menu)

// 		return () => document.removeEventListener("click", hide_context_menu)
// 	}, [menu, logger, hide_context_menu])

// 	return (
// 		<div
// 			ref={ref}
// 			style={is_mobile ? { top, left: 10, alignSelf: "center" } : { top, left }}
// 			className={`absolute z-[1000] w-80 rounded-lg bg-white px-2 shadow-lg transition-opacity duration-300 dark:bg-neutral-500 ${
// 				menu && menu.structure.length ? "opacity-100" : "opacity-0"
// 			}`}
// 		>
// 			{Either.fromNullable(menu).fold(Null, menu => (
// 				<div className="flex flex-col divide-y">
// 					{Either.fromBoolean(() => creators.length > 0)
// 						.chain(() => Either.fromBoolean(() => !menu.hide_create_items))
// 						.fold(Null, () => (
// 							<List items={creators} event={menu.event as any} payload={menu.payload} />
// 						))}

// 					{Either.fromBoolean(() => readers.length > 0)
// 						.chain(() => Either.fromBoolean(() => !menu.hide_read_items))
// 						.fold(Null, () => (
// 							<List items={readers} event={menu.event as any} payload={menu.payload} />
// 						))}

// 					{Either.fromBoolean(() => updaters.length > 0)
// 						.chain(() => Either.fromBoolean(() => !menu.hide_update_items))
// 						.fold(Null, () => (
// 							<List items={updaters} event={menu.event as any} payload={menu.payload} />
// 						))}

// 					{Either.fromBoolean(() => removers.length > 0)
// 						.chain(() => Either.fromBoolean(() => !menu.hide_delete_items))
// 						.fold(Null, () => (
// 							<List items={removers} event={menu.event as any} payload={menu.payload} />
// 						))}
// 				</div>
// 			))}
// 		</div>
// 	)
// }

// // --- Internal ---

// type AddP = (i: Client.CtxMenu.Item) => (is: Client.CtxMenu.Item[]) => Client.CtxMenu.Item[]
// type RemoveP = (id: string) => (is: Client.CtxMenu.Item[]) => Client.CtxMenu.Item[]

// const addP: AddP = item => state => state.filter(i => i.cmd !== item.cmd).concat([item])
// const removeP: RemoveP = name => state => state.filter(item => item.cmd !== name)

// const add$ = new Subject<Client.CtxMenu.Item>()
// const remove$ = new Subject<string>()
// const custom_context_menu$ = new BehaviorSubject<Client.CtxMenu.ShowOptions | null>(null)
// const global_context_menu$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
// 	scan((acc, f) => f(acc), [] as Client.CtxMenu.Item[]),
// 	shareReplay(1),
// )

// const context_menu$ = custom_context_menu$.pipe(
// 	combineLatestWith(global_context_menu$),
// 	map(([state, items]) =>
// 		Either.fromNullable(state)
// 			.chain(state => Either.fromNullable(items).map(() => state))
// 			.fold(Null, state => ({
// 				...state,
// 				structure: items.filter(item => {
// 					const shouldShow =
// 						state.payload === LIB_DIRECTORY_FSID ||
// 						(state.payload &&
// 							Metadata.Validations.is_metadata(state.payload) &&
// 							state.payload.get_fsid() === LIB_DIRECTORY_FSID)
// 							? false
// 							: item?.should_show({ event: state.event, payload: state.payload }) ?? false

// 					if (shouldShow && state.event.stopPropagation) state.event.stopPropagation()

// 					return shouldShow
// 				}),
// 			})),
// 	),
// )

// type TListP = { items: Client.CtxMenu.Item[]; event: MouseEvent; payload?: any }
// function List({ items, event, payload }: TListP) {
// 	return (
// 		<div className="py-2">
// 			{items.map(item => (
// 				<Item key={item.cmd} item={item} event={event} payload={payload} />
// 			))}
// 		</div>
// 	)
// }

// type TItemP = { event: any; item: Client.CtxMenu.Item; payload?: any }
// function Item({ item, event, payload: p }: TItemP) {
// 	const commands = use$.commands()

// 	const payload = item.payload_creator ? item.payload_creator({ payload: p, event }) : p
// 	const is_disabled = !!item.should_be_disabled && item.should_be_disabled({ event, payload })

// 	const on_accelerator_used = () =>
// 		Result.If(is_disabled).cata({
// 			Ok: () => commands.emit("cmd.application.context_menu.hide"),
// 			Err: () => commands.emit(item.cmd, payload),
// 		})

// 	use$.accelerator(item.accelerator, on_accelerator_used)

// 	return (
// 		<ActionListItem
// 			key={item.cmd}
// 			Icon={item.Icon}
// 			current={false}
// 			onClick={on_accelerator_used}
// 			text={item.readable_name}
// 			disabled={is_disabled}
// 		>
// 			<RenderFromNullable having={item.accelerator}>
// 				<Accelerator accelerator={item.accelerator!} />
// 			</RenderFromNullable>
// 		</ActionListItem>
// 	)
// }
