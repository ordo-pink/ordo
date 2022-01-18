import React from "react"
import { getSupportedIcon } from "../../icons/supported-icons"
import { Command, CommanderState } from "./types"

const Command: React.FC<Command> = ({ icon, name, description }) => {
	const Icon = icon ? getSupportedIcon(icon) : () => null

	return (
		<div className="text-sm hover:bg-gray-200 p-2 last-of-type:rounded-b-lg cursor-pointer">
			<div className="flex items-center space-x-2">
				<Icon className="text-gray-500" />
				<div className="text-gray-700">{name}</div>
			</div>

			<div className="text-gray-500">{description}</div>
		</div>
	)
}

export const Commander: React.FC<CommanderState> = (state) => {
	if (!state.show) {
		return null
	}

	const [filter, setFilter] = React.useState("")

	return (
		<div className="space-y-2">
			<input
				className="w-full outline-none p-2"
				placeholder="What is that you truely desire?"
				autoFocus={state.show}
				type="text"
				value={filter}
				onChange={(e) => {
					setFilter(e.target.value)
					window.ordo.emit("@commander/get-items", e.target.value)
				}}
			/>
			<hr />
			<div>
				{state.items.map((item) => (
					<Command key={item.name} name={item.name} description={item.description} icon={item.icon} />
				))}
			</div>
		</div>
	)
}
