// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { Either } from "@ordo-pink/either"
import { useSubscription } from "$hooks/use-subscription"
import { __ContextMenu$ } from "$streams/context-menu"
import ContextMenuItemList from "$components/context-menu/context-menu-item-list"
import Null from "$components/null"
import { getCommands } from "$streams/commands"
import { ContextMenu as TContextMenu } from "@ordo-pink/libfe"

const commands = getCommands()

type _P = { menu$: __ContextMenu$ }
export default function ContextMenu({ menu$ }: _P) {
	const [readers, setReaders] = useState<TContextMenu.Item[]>([])
	const [creators, setCreators] = useState<TContextMenu.Item[]>([])
	const [updaters, setUpdaters] = useState<TContextMenu.Item[]>([])
	const [removers, setRemovers] = useState<TContextMenu.Item[]>([])

	const menu = useSubscription(menu$)

	useHotkeys("Esc", () => menu && commands.emit("context-menu.hide"))

	useEffect(() => {
		if (!menu) {
			setReaders([])
			setCreators([])
			setUpdaters([])
			setRemovers([])

			return
		}

		menu.event.preventDefault()

		const readCommands = [] as TContextMenu.Item[]
		const createCommands = [] as TContextMenu.Item[]
		const updateCommands = [] as TContextMenu.Item[]
		const deleteCommands = [] as TContextMenu.Item[]

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
	}, [menu])

	return (
		<div
			style={{ top: menu?.event.clientY ?? -50, left: menu?.event.clientX ?? -50 }}
			className={`absolute z-[1000] bg-white dark:bg-neutral-500 shadow-lg transition-opacity w-80 duration-300 rounded-lg p-2 ${
				menu && menu.structure.length ? "opacity-100" : "opacity-0"
			}`}
		>
			{menu ? (
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
			) : null}
		</div>
	)
}
