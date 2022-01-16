import React from "react"

export type StatusBarState = {
	show: boolean
	items: StatusBarItemProps[]
}

export type StatusBarItemProps = {
	show?: boolean
	icon?: React.FC | string
	text?: string
	description?: string
	onClick?: (x: unknown) => void | Promise<void>
}
