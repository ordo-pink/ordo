import React from "react"
import { StatusBarItemProps } from "./types"

export const StatusBarItem: React.FC<StatusBarItemProps> = ({
	icon,
	show = true,
	text = "",
	description = "",
	onClick = () => void 0,
}) => {
	if (!show) {
		return null
	}

	const Icon = icon && typeof icon !== "string" ? icon : () => null
	const Text = text ? () => <p>{text}</p> : () => null

	return (
		<div
			className="flex items-center space-x-1 px-3 py-1 hover:bg-gray-200 cursor-pointer"
			onClick={onClick}
			title={description}
		>
			<Icon />
			<Text />
		</div>
	)
}
