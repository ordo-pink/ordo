import React from "react"
import { WindowState } from "../../state"

export type Command = {
	icon?: React.FC
	text: string
	action: (state: WindowState) => void
}

export type CommanderState = {
	show: boolean
	commands: Command[]
}
