import React from "react"
import { useAppSelector } from "../../common/store-hooks"
import { getSupportedIcon } from "../../application/appearance/icons/supported-icons"
import { Command } from "./types"

const Command: React.FC<Command> = ({ icon, name, description, shortcut, event }) => {
	const Icon = icon ? getSupportedIcon(icon) : () => null

	return (
		<div className="flex space-x-2 text-sm hover:bg-gray-200 text-gray-500 p-2 last-of-type:rounded-b-lg cursor-pointer select-none">
			<div className="flex-grow" onClick={() => window.ordo.emit("@commander/run", event[0])}>
				<div className="flex items-center space-x-2">
					<Icon />
					<div className="text-gray-700">{name}</div>
				</div>

				<div>{description}</div>
			</div>
			<div className="text-xs">{shortcut}</div>
		</div>
	)
}

export const Commander: React.FC = () => {
	const show = useAppSelector((state) => state.commander.show)
	const items = useAppSelector((state) => state.commander.items)

	const [filter, setFilter] = React.useState("")

	if (!show) {
		return null
	}

	return (
		<div>
			<input
				className="w-full outline-none p-2 rounded-lg"
				placeholder="What is that you truely desire?"
				autoFocus={show}
				type="text"
				value={filter}
				onChange={(e) => {
					setFilter(e.target.value)
					window.ordo.emit("@commander/get-items", e.target.value)
				}}
			/>
			<div className="rounded-b-lg">
				{items.map((item) => (
					<Command
						key={item.name}
						name={item.name}
						description={item.description}
						icon={item.icon}
						shortcut={item.shortcut}
						event={item.event}
					/>
				))}
			</div>
		</div>
	)
}
