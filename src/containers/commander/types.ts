export type Command = {
	icon?: string
	text: string
	id: string
}

export type CommanderState = {
	show: boolean
	items: Command[]
}
