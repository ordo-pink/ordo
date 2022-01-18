import React from "react"
import { getSupportedIcon } from "../../icons/supported-icons"
import { Either } from "../../common/eithers"
import { ActivityBarItem, ActivityBarState } from "./types"

export const Activity: React.FC<ActivityBarItem> = ({ show, icon, name }) =>
	Either.fromBoolean(show)
		.chain(() => Either.fromNullable(icon))
		.chain((i) => Either.fromNullable(getSupportedIcon(i)))
		.fold(
			() => null,
			(Icon) => (
				<Icon
					className="cursor-pointer hover:text-gray-900 transition-all duration-300"
					title={name}
					onClick={() => window.ordo.emit("@activity-bar/select", name)}
				/>
			),
		)

export const ActivityBar: React.FC<ActivityBarState> = ({ show, topItems, bottomItems }) =>
	Either.fromBoolean(show).fold(
		() => null,
		() => (
			<div className="text-3xl text-gray-600 flex flex-col justify-between h-full p-2">
				<div className="flex flex-col space-y-2">
					{topItems.map((item) => (
						<Activity key={item.name} name={item.name} show={item.show} icon={item.icon} />
					))}
				</div>
				<div className="flex flex-col space-y-2">
					{bottomItems.map((item) => (
						<Activity key={item.name} name={item.name} show={item.show} icon={item.icon} />
					))}
				</div>
			</div>
		),
	)
