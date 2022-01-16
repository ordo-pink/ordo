import React from "react"
import { IconType } from "react-icons"

export type StatusBarItemProps = {
	show?: boolean
	icon?: React.FC | string
	text?: string
	description?: string
	onClick?: (x: unknown) => void | Promise<void>
}
