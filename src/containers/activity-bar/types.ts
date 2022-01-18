export type ActivityBarState = {
	show: boolean
	items: ActivityBarItem[]
}

export type ActivityBarItem = {
	show: boolean
	icon?: string
	text?: string
	description?: string
}
