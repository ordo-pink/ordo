import { useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { Either } from "#lib/either/mod"
import { useSubscription } from "$hooks/use-subscription"
import { ContextMenuItem, __ContextMenu$ } from "$streams/context-menu"
import ContextMenuItemList from "$components/context-menu/context-menu-item-list"
import Null from "$components/null"
import { getCommands } from "$streams/commands"

const commands = getCommands()

type _P = { menu$: __ContextMenu$ }
export default function ContextMenu({ menu$ }: _P) {
	const [readers, setReaders] = useState<ContextMenuItem[]>([])
	const [creators, setCreators] = useState<ContextMenuItem[]>([])
	const [updaters, setUpdaters] = useState<ContextMenuItem[]>([])
	const [removers, setRemovers] = useState<ContextMenuItem[]>([])

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

		const readCommands = [] as ContextMenuItem[]
		const createCommands = [] as ContextMenuItem[]
		const updateCommands = [] as ContextMenuItem[]
		const deleteCommands = [] as ContextMenuItem[]

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
