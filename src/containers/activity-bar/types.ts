import React from "react"

export type ActivityBarState = {
	show: boolean
	items: ActivityBarItem[]
}

export type ActivityBarItem = {
	show: boolean
	icon?: React.FC
	text?: string
	description?: string
	commands?: null
	panels?: null
	workspaces?: null
	sidebars?: null
	suggestions?: null
}
