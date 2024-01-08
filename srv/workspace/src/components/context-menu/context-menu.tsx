// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"
import { Either } from "@ordo-pink/either"
import { useSubscription } from "$hooks/use-subscription"
import { __ContextMenu$ } from "$streams/context-menu"
import ContextMenuItemList from "$components/context-menu/context-menu-item-list"
import Null from "$components/null"
import { getCommands } from "$streams/commands"
import { CtxMenu } from "@ordo-pink/frontend-core"
import { useAccelerator } from "$hooks/use-accelerator.hook"

const commands = getCommands()

type _P = { menu$: __ContextMenu$ }
export default function ContextMenu({ menu$ }: _P) {
	const [readers, setReaders] = useState<CtxMenu.Item[]>([])
	const [creators, setCreators] = useState<CtxMenu.Item[]>([])
	const [updaters, setUpdaters] = useState<CtxMenu.Item[]>([])
	const [removers, setRemovers] = useState<CtxMenu.Item[]>([])

	const menu = useSubscription(menu$)

	useAccelerator("Esc", () => menu && commands.emit<cmd.ctxMenu.hide>("context-menu.hide"))

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
	}, [menu])

	return (
		<div
			style={{ top: menu?.event.clientY ?? -50, left: menu?.event.clientX ?? -50 }}
			className={`absolute z-[1000] bg-white dark:bg-neutral-500 shadow-lg transition-opacity w-80 duration-300 rounded-lg px-2 ${
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
