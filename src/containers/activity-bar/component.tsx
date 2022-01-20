import React from "react"
import { useAppSelector } from "../../common/store-hooks"
import { getSupportedIcon } from "../../application/appearance/icons/supported-icons"
import { ActivityBarItem } from "./types"

export const Activity: React.FC<ActivityBarItem & { current?: string }> = ({ show, icon, name, current }) => {
	if (!show || !icon) {
		return null
	}

	const Icon = getSupportedIcon(icon)

	const color = current === name ? "text-pink-600 hover:text-pink-900" : "text-gray-600 hover:text-gray-900"

	return (
		<Icon
			title={name}
			className={`cursor-pointer transition-all duration-300 ${color}`}
			onClick={() => window.ordo.emit("@activity-bar/select", name)}
		/>
	)
}

export const ActivityBar: React.FC = () => {
	const show = useAppSelector((state) => state.activities.show)
	const topItems = useAppSelector((state) => state.activities.topItems)
	const bottomItems = useAppSelector((state) => state.activities.bottomItems)
	const current = useAppSelector((state) => state.activities.current)

	if (!show) {
		return null
	}

	return (
		<div className="text-3xl flex flex-col justify-between h-full p-2">
			<div className="flex flex-col space-y-2">
				{topItems.map((item) => (
					<Activity key={item.name} name={item.name} show={item.show} icon={item.icon} current={current} />
				))}
			</div>
			<div className="flex flex-col space-y-2">
				{bottomItems.map((item) => (
					<Activity key={item.name} name={item.name} show={item.show} icon={item.icon} current={current} />
				))}
			</div>
		</div>
	)
}
