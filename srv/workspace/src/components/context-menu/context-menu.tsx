import { useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import MenuItem from "./context-menu-item"
import { Either } from "#lib/either/mod"
import { ContextMenuItem, useContextMenu, useContextMenuState } from "../../streams/context-menu"
import Null from "../null"

export default function ContextMenu() {
	const state = useContextMenuState()
	const contextMenu = useContextMenu()

	useHotkeys("Esc", () => contextMenu.hide())

	const [readers, setReaders] = useState<ContextMenuItem[]>([])
	const [creators, setCreators] = useState<ContextMenuItem[]>([])
	const [updaters, setUpdaters] = useState<ContextMenuItem[]>([])
	const [removers, setRemovers] = useState<ContextMenuItem[]>([])

	useEffect(() => {
		if (!state) {
			setReaders([])
			setCreators([])
			setUpdaters([])
			setRemovers([])

			return
		}

		const readCommands = [] as ContextMenuItem[]
		const createCommands = [] as ContextMenuItem[]
		const updateCommands = [] as ContextMenuItem[]
		const deleteCommands = [] as ContextMenuItem[]

		state.structure.forEach(item => {
			if (item.type === "create") createCommands.push(item)
			else if (item.type === "read") readCommands.push(item)
			else if (item.type === "update") updateCommands.push(item)
			else if (item.type === "delete") deleteCommands.push(item)
		})

		setCreators(createCommands)
		setReaders(readCommands)
		setUpdaters(updateCommands)
		setRemovers(deleteCommands)
	}, [state])

	return (
		<div
			style={{ top: state?.y ?? -50, left: state?.x ?? -50 }}
			className={`absolute z-[1000] bg-white dark:bg-neutral-500 shadow-lg transition-opacity w-80 duration-300 rounded-lg p-2 ${
				state && state.structure.length ? "opacity-100" : "opacity-0"
			}`}
		>
			{state ? (
				<div className="flex flex-col divide-y">
					{Either.fromBoolean(() => creators.length > 0)
						.chain(() => Either.fromBoolean(() => !state.hideCreateCommands))
						.fold(Null, () => (
							<div className="py-2">
								{creators.map(item => (
									<MenuItem key={item.name} item={item} state={{ ...state, structure: creators }} />
								))}
							</div>
						))}

					{Either.fromBoolean(() => readers.length > 0)
						.chain(() => Either.fromBoolean(() => !state.hideReadCommands))
						.fold(Null, () => (
							<div className="py-2">
								{readers.map(item => (
									<MenuItem key={item.name} item={item} state={{ ...state, structure: readers }} />
								))}
							</div>
						))}

					{Either.fromBoolean(() => updaters.length > 0)
						.chain(() => Either.fromBoolean(() => !state.hideUpdateCommands))
						.fold(Null, () => (
							<div className="py-2">
								{updaters.map(item => (
									<MenuItem key={item.name} item={item} state={{ ...state, structure: updaters }} />
								))}
							</div>
						))}

					{Either.fromBoolean(() => removers.length > 0)
						.chain(() => Either.fromBoolean(() => !state.hideDeleteCommands))
						.fold(Null, () => (
							<div className="py-2">
								{removers.map(item => (
									<MenuItem key={item.name} item={item} state={{ ...state, structure: removers }} />
								))}
							</div>
						))}
				</div>
			) : null}
		</div>
	)
}
